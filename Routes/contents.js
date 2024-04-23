const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');

oracledb.fetchAsString = [ oracledb.CLOB ];

function creator(st){
    if(st){
        s =''
        for (let i=0;i<st.length;i++){
            if(st[i]=='\'')
                s+="''";
            else{
                s+=st[i];
            }
        }
        return s;
    }
    return st;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// router.post('/',(req,res)=>{
//     //console.log(req.body.id,req.body.type);
//     req.app.id=req.body.id;
//     req.app.type=req.body.type;
// })

router.get('/:id/:type',(req,res)=>{
    var id=req.params.id;
    var type=req.params.type;
    var content,character,link,source,watchlist=2,rate,reviews,rank;
    try {
        oracledb.getConnection(
            {
                user: 'c##test',
                password: 'test',
                tns: 'localhost:1521/orcl'
            },
            (err, con) => {
                if (err) {
                    res.send('db connnection error', err);
                } else {
                    var o;
                    if(req.session.user){
                         o=`select islock(${req.session.user_id},${id}) from dual`;
                    }
                    else{
                        o=`select islock(NULL,${id}) from dual`;
                    }
                    //console.log(o)
                    con.execute(o, [], { autoCommit: true }, (eb, rb) => {
                        if(eb){
                            res.send('other errors1');
                        }
                        else {
                            if(rb.rows[0][0]=='true'){
                                try {
                                    oracledb.getConnection(
                                        {
                                            user: 'c##test',
                                            password: 'test',
                                            tns: 'localhost:1521/orcl'
                                        },
                                        (err, con) => {
                                            if (err) {
                                                res.send('db connnection error', err);
                                            } else {
                                                const p = `select id,title,type,source_id,locked,cover_pic,synopsis,toprank(id) from contents where type = '${req.params.type}' order by toprank(id) DESC NULLS LAST`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors1');
                                                    }
                                                    else {
                                                        //console.log(r);
                                                        var cnt=0;
                                                        for(let i=0;i<r.rows.length;i++){
                                                            cnt++;
                                                            if(r.rows[i][0]==req.params.id){
                                                                if(r.rows[i][7]){
                                                                    rank=cnt;
                                                                }
                                                                break;
                                                            }
                                                        }
                                                        try {
                                                            oracledb.getConnection(
                                                                {
                                                                    user: 'c##test',
                                                                    password: 'test',
                                                                    tns: 'localhost:1521/orcl'
                                                                },
                                                                (err, con) => {
                                                                    if (err) {
                                                                        res.send('db connnection error', err);
                                                                    } else {
                                                                        if(req.session.user){
                                                                            const p = `select count(*) from WATCH_LIST where user_id=idreturn('${creator(req.session.user)}') AND CONTENT_ID=${id}`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    console.log(e);
                                                                                    res.send('other errors 1 me');
                                                                                }
                                                                                else {
                                                                                    watchlist=r.rows[0][0];
                                                                                    try {
                                                                                        oracledb.getConnection(
                                                                                            {
                                                                                                user: 'c##test',
                                                                                                password: 'test',
                                                                                                tns: 'localhost:1521/orcl'
                                                                                            },
                                                                                            (err, con) => {
                                                                                                if (err) {
                                                                                                    res.send('db connnection error', err);
                                                                                                } else {                       
                                                                                                    const p = `select rating from enjoys where user_id=idreturn('${creator(req.session.user)}') AND CONTENT_ID=${id}`;
                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                        if(e){
                                                                                                            res.send('other errors 2');
                                                                                                        }
                                                                                                        else {
                                                                                                            // console.log(r);
                                                                                                            if(r.rows.length>0)     
                                                                                                                rate=r.rows[0][0];
                                                                                                            try {
                                                                                                                oracledb.getConnection(
                                                                                                                    {
                                                                                                                        user: 'c##test',
                                                                                                                        password: 'test',
                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                    },
                                                                                                                    (err, con) => {
                                                                                                                        if (err) {
                                                                                                                            res.send('db connnection error', err);
                                                                                                                        } else {                       
                                                                                                                            const p = `select namereturn(USER_id) AS "username",rating,review,user_id from ENJOYS where CONTENT_ID=${id}`;
                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                if(e){
                                                                                                                                    res.send('other errors 3');
                                                                                                                                }
                                                                                                                                else {     
                                                                                                                                    reviews=r.rows;
                                                                                                                                    try {
                                                                                                                                        oracledb.getConnection(
                                                                                                                                            {
                                                                                                                                                user: 'c##test',
                                                                                                                                                password: 'test',
                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                            },
                                                                                                                                            (err, con) => {
                                                                                                                                                if (err) {
                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                } else {
                                                                                                                                                    if(type=='anime'){
                                                                                                                                                        var p = `select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,EPISODE_NO AS "EPISODE NO",STATUS,TO_CHAR(air_start_date, 'MON DD, YYYY' ) AS "AIR START DATE",TO_CHAR(air_end_date, 'MON DD, YYYY' ) AS "AIR END DATE",SEASON,PRODUCERS,LICENSORS,STUDIOS,SOURCE,GENRES,DURATION FROM CONTENTS JOIN ANIME ON CONTENTS.id=ANIME.id where CONTENTS.id='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='manga'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,chapters,STATUS,GENRES,AUTHORS_ARTISTS AS "AUTHORS & ARTISTS" from contents join manga on CONTENTS.id=MANGA.id where CONTENTS.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='lightnovel'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,TO_CHAR(PUBLISH_DATE, 'MON DD, YYYY' ) AS "PUBLISH DATE",STATUS,GENRES,AUTHORS from contents join lightnovel on contents.ID=LIGHTNOVEL.ID where contents.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='movie'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,TO_CHAR(release_date, 'MON DD, YYYY' ) AS "Release Date",PRODUCERS,LICENSORS,STUDIOS,SOURCE,DURATION from contents join movie on contents.ID=movie.ID where contents.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                        if(e){
                                                                                                                                                            res.send('other errors no');
                                                                                                                                                        }
                                                                                                                                                        else {
                                                                                                                                                            //console.log(r.metaData[0].name);
                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                            content=r;
                                                                                                                                                            for(let i=0;i<content.metaData.length;i++){
                                                                                                                                                                content.metaData[i].name=capitalizeFirstLetter(content.metaData[i].name);
                                                                                                                                                            }
                                                                                                                                                            // console.log(content);
                                                                                                                                                            try {
                                                                                                                                                                oracledb.getConnection(
                                                                                                                                                                    {
                                                                                                                                                                        user: 'c##test',
                                                                                                                                                                        password: 'test',
                                                                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                                                                    },
                                                                                                                                                                    (err, con) => {
                                                                                                                                                                        if (err) {
                                                                                                                                                                            res.send('db connnection error', err);
                                                                                                                                                                        } else {
                                                                                                                                                                            const p = `select CHARACTER_ID,name,character_list.type,url,description from contents join character_list on contents.ID=character_list.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                if(e){
                                                                                                                                                                                    res.send('other errors no2');
                                                                                                                                                                                }
                                                                                                                                                                                else {
                                                                                                                                                                                    //console.log(r.rows);
                                                                                                                                                                                    //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                    character=r.rows;
                                                                                                                                                                                    try {
                                                                                                                                                                                        oracledb.getConnection(
                                                                                                                                                                                            {
                                                                                                                                                                                                user: 'c##test',
                                                                                                                                                                                                password: 'test',
                                                                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                                                                            },
                                                                                                                                                                                            (err, con) => {
                                                                                                                                                                                                if (err) {
                                                                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    const p = `select links.type,link from contents join links on contents.ID=links.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                        if(e){
                                                                                                                                                                                                            res.send('other errors no3');
                                                                                                                                                                                                        }
                                                                                                                                                                                                        else {
                                                                                                                                                                                                            //console.log(r.rows);
                                                                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                            link=r.rows;
                                                                                                                                                                                                            if(content.rows[0][2]==null){
                                                                                                                                                                                                                source=null;
                                                                                                                                                                                                                // console.log(source);
                                                                                                                                                                                                                // console.log(watchlist,rate,reviews);
                                                                                                                                                                                                                res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                            }
                                                                                                                                                                                                            else{
                                                                                                                                                                                                                try {
                                                                                                                                                                                                                    oracledb.getConnection(
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            user: 'c##test',
                                                                                                                                                                                                                            password: 'test',
                                                                                                                                                                                                                            tns: 'localhost:1521/orcl'
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        (err, con) => {
                                                                                                                                                                                                                            if (err) {
                                                                                                                                                                                                                                res.send('db connnection error', err);
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                const p = `select title,type from contents where id='${content.rows[0][2]}'`;
                                                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                                                        res.send('other errors no4');
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    else {
                                                                                                                                                                                                                                        //console.log(r.rows);
                                                                                                                                                                                                                                        //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                                                        source=r.rows[0];
                                                                                                                                                                                                                                        // console.log(source);
                                                                                                                                                                                                                                        // console.log(watchlist,rate,reviews);
                                                                                                                                                                                                                                        //console.log("done")
                                                                                                                                                                                                                                        res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    );
                                                                                                                                                                                                                } 
                                                                                                                                                                                                                catch (e) {
                                                                                                                                                                                                                    console.log(e);
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                            
                                                                                                                                                                                                        }
                                                                                                                                                                                                    });
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        );
                                                                                                                                                                                    } 
                                                                                                                                                                                    catch (e) {
                                                                                                                                                                                        console.log(e);
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                );
                                                                                                                                                            } 
                                                                                                                                                            catch (e) {
                                                                                                                                                                console.log(e);
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        );
                                                                                                                                    } 
                                                                                                                                    catch (e) {
                                                                                                                                        console.log(e);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }
                                                                                                                );
                                                                                                            } 
                                                                                                            catch (e) {
                                                                                                                console.log(e);
                                                                                                            }
                                                                                                        }
                                                                                                    });                          
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    } 
                                                                                    catch (e) {
                                                                                        console.log(e);
                                                                                    }
                                                                                    
                                                                                }
                                                                            });
                                                                        }
                                                                        else{
                                                                            try {
                                                                                oracledb.getConnection(
                                                                                    {
                                                                                        user: 'c##test',
                                                                                        password: 'test',
                                                                                        tns: 'localhost:1521/orcl'
                                                                                    },
                                                                                    (err, con) => {
                                                                                        if (err) {
                                                                                            res.send('db connnection error', err);
                                                                                        } else {                       
                                                                                            const p = `select namereturn(USER_id) AS "username",rating,review,user_id from ENJOYS where CONTENT_ID=${id}`;
                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                if(e){
                                                                                                    res.send('other errors 3');
                                                                                                }
                                                                                                else {     
                                                                                                    reviews=r.rows;
                                                                                                    try {
                                                                                                        oracledb.getConnection(
                                                                                                            {
                                                                                                                user: 'c##test',
                                                                                                                password: 'test',
                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                            },
                                                                                                            (err, con) => {
                                                                                                                if (err) {
                                                                                                                    res.send('db connnection error', err);
                                                                                                                } else {
                                                                                                                    if(type=='anime'){
                                                                                                                        var p = `select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,EPISODE_NO AS "EPISODE NO",STATUS,TO_CHAR(air_start_date, 'MON DD, YYYY' ) AS "AIR START DATE",TO_CHAR(air_end_date, 'MON DD, YYYY' ) AS "AIR END DATE",SEASON,PRODUCERS,LICENSORS,STUDIOS,SOURCE,GENRES,DURATION FROM CONTENTS JOIN ANIME ON CONTENTS.id=ANIME.id where CONTENTS.id='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='manga'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,chapters,STATUS,GENRES,AUTHORS_ARTISTS AS "AUTHORS & ARTISTS" from contents join manga on CONTENTS.id=MANGA.id where CONTENTS.ID='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='lightnovel'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,TO_CHAR(PUBLISH_DATE, 'MON DD, YYYY' ) AS "PUBLISH DATE",STATUS,GENRES,AUTHORS from contents join lightnovel on contents.ID=LIGHTNOVEL.ID where contents.ID='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='movie'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,TO_CHAR(release_date, 'MON DD, YYYY' ) AS "Release Date",PRODUCERS,LICENSORS,STUDIOS,SOURCE,DURATION from contents join movie on contents.ID=movie.ID where contents.ID='${id}'`;
                                                                                                                    }
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                        if(e){
                                                                                                                            res.send('other errors this');
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            //console.log(r.metaData[0].name);
                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                            content=r;
                                                                                                                            for(let i=0;i<content.metaData.length;i++){
                                                                                                                                content.metaData[i].name=capitalizeFirstLetter(content.metaData[i].name);
                                                                                                                            }
                                                                                                                            // console.log(content);
                                                                                                                            try {
                                                                                                                                oracledb.getConnection(
                                                                                                                                    {
                                                                                                                                        user: 'c##test',
                                                                                                                                        password: 'test',
                                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                                    },
                                                                                                                                    (err, con) => {
                                                                                                                                        if (err) {
                                                                                                                                            res.send('db connnection error', err);
                                                                                                                                        } else {
                                                                                                                                            
                                                                                                                                            const p = `select CHARACTER_ID,name,character_list.type,url,description from contents join character_list on contents.ID=character_list.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                if(e){
                                                                                                                                                    res.send('other errors this2');
                                                                                                                                                }
                                                                                                                                                else {
                                                                                                                                                    //console.log(r.rows);
                                                                                                                                                    //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                    character=r.rows;
                                                                                                                                                    //console.log(r.rows[0][4])
                                                                                                                                                    try {
                                                                                                                                                        oracledb.getConnection(
                                                                                                                                                            {
                                                                                                                                                                user: 'c##test',
                                                                                                                                                                password: 'test',
                                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                                            },
                                                                                                                                                            (err, con) => {
                                                                                                                                                                if (err) {
                                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                                } else {
                                                                                                                                                                    const p = `select links.type,link from contents join links on contents.ID=links.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                        if(e){
                                                                                                                                                                            res.send('other errors this3');
                                                                                                                                                                        }
                                                                                                                                                                        else {
                                                                                                                                                                            //console.log(r.rows);
                                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                            link=r.rows;
                                                                                                                                                                            if(content.rows[0][2]==null){
                                                                                                                                                                                source=null;
                                                                                                                                                                                //console.log(watchlist,rate,reviews);
                                                                                                                                                                                res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                            }
                                                                                                                                                                            else{
                                                                                                                                                                                try {
                                                                                                                                                                                    oracledb.getConnection(
                                                                                                                                                                                        {
                                                                                                                                                                                            user: 'c##test',
                                                                                                                                                                                            password: 'test',
                                                                                                                                                                                            tns: 'localhost:1521/orcl'
                                                                                                                                                                                        },
                                                                                                                                                                                        (err, con) => {
                                                                                                                                                                                            if (err) {
                                                                                                                                                                                                res.send('db connnection error', err);
                                                                                                                                                                                            } else {
                                                                                                                                                                                                const p = `select title,type from contents where id='${content.rows[0][2]}'`;
                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                        res.send('other errors this4');
                                                                                                                                                                                                    }
                                                                                                                                                                                                    else {
                                                                                                                                                                                                        //console.log(r.rows);
                                                                                                                                                                                                        //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                        source=r.rows[0];
                                                                                                                                                                                                        //console.log(source);
                                                                                                                                                                                                        //console.log(watchlist,rate,reviews);
                                                                                                                                                                                                        res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                    }
                                                                                                                                                                                                });
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    );
                                                                                                                                                                                } 
                                                                                                                                                                                catch (e) {
                                                                                                                                                                                    console.log(e);
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            
                                                                                                                                                                        }
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        );
                                                                                                                                                    } 
                                                                                                                                                    catch (e) {
                                                                                                                                                        console.log(e);
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            } 
                                                                                                                            catch (e) {
                                                                                                                                console.log(e);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            }
                                                                                                        );
                                                                                                    } 
                                                                                                    catch (e) {
                                                                                                        console.log(e);
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                );
                                                                            } 
                                                                            catch (e) {
                                                                                console.log(e);
                                                                            }
                                                                        }
                                                                        
                                                                    }
                                                                }
                                                            );
                                                        } 
                                                        catch (e) {
                                                            console.log(e);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            else{
                                res.render('notsubscribed',{username:req.session.user,admin:req.session.admin})
                            }
                        }
                    });
                }
            }
        );
    }
    catch (e) {
        console.log(e);
    }
    //console.log(content);console.log(character);console.log(link);
    
});



router.get('/:id/:type/:msg',(req,res)=>{
    var msg;
    if(req.params.msg){
        if(req.params.msg==1){
            msg='You are not logged in';
        }
        if(req.params.msg==2){
            msg='Successfully reviewed';
        }
        if(req.params.msg==3){
            msg='Successfully added to watchlist';
        }
        if(req.params.msg==4){
            msg='Successfully removed from watchlist';
        }
    }
    var id=req.params.id;
    var type=req.params.type;

    var content,character,link,source,watchlist=2,rate,reviews,rank;

    try {
        oracledb.getConnection(
            {
                user: 'c##test',
                password: 'test',
                tns: 'localhost:1521/orcl'
            },
            (err, con) => {
                if (err) {
                    res.send('db connnection error', err);
                } else {
                    var o;
                    if(req.session.user){
                         o=`select islock(${req.session.user_id},${id}) from dual`;
                    }
                    else{
                        o=`select islock(NULL,${id}) from dual`;
                    }
                    con.execute(o, [], { autoCommit: true }, (eb, rb) => {
                        if(eb){
                            res.send('other errors');
                        }
                        else {
                            if(rb.rows[0][0]=='true'){
                                try {
                                    oracledb.getConnection(
                                        {
                                            user: 'c##test',
                                            password: 'test',
                                            tns: 'localhost:1521/orcl'
                                        },
                                        (err, con) => {
                                            if (err) {
                                                res.send('db connnection error', err);
                                            } else {
                                                const p = `select id,title,type,source_id,locked,cover_pic,synopsis,toprank(id) from contents where type = '${req.params.type}' order by toprank(id) DESC NULLS LAST`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        //console.log(r);
                                                        var cnt=0;
                                                        for(let i=0;i<r.rows.length;i++){
                                                            cnt++;
                                                            if(r.rows[i][0]==req.params.id){
                                                                if(r.rows[i][7]){
                                                                    rank=cnt;
                                                                }
                                                                break;
                                                            }
                                                        }
                                                        try {
                                                            oracledb.getConnection(
                                                                {
                                                                    user: 'c##test',
                                                                    password: 'test',
                                                                    tns: 'localhost:1521/orcl'
                                                                },
                                                                (err, con) => {
                                                                    if (err) {
                                                                        res.send('db connnection error', err);
                                                                    } else {
                                                                        if(req.session.user){
                                                                            const p = `select count(*) from WATCH_LIST where user_id=idreturn('${creator(req.session.user)}') AND CONTENT_ID=${id}`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    console.log(e);
                                                                                    res.send('other errors 1 me');
                                                                                }
                                                                                else {
                                                                                    watchlist=r.rows[0][0];
                                                                                    try {
                                                                                        oracledb.getConnection(
                                                                                            {
                                                                                                user: 'c##test',
                                                                                                password: 'test',
                                                                                                tns: 'localhost:1521/orcl'
                                                                                            },
                                                                                            (err, con) => {
                                                                                                if (err) {
                                                                                                    res.send('db connnection error', err);
                                                                                                } else {                       
                                                                                                    const p = `select rating from enjoys where user_id=idreturn('${creator(req.session.user)}') AND CONTENT_ID=${id}`;
                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                        if(e){
                                                                                                            res.send('other errors 2');
                                                                                                        }
                                                                                                        else {
                                                                                                            // console.log(r);
                                                                                                            if(r.rows.length>0)     
                                                                                                                rate=r.rows[0][0];
                                                                                                            try {
                                                                                                                oracledb.getConnection(
                                                                                                                    {
                                                                                                                        user: 'c##test',
                                                                                                                        password: 'test',
                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                    },
                                                                                                                    (err, con) => {
                                                                                                                        if (err) {
                                                                                                                            res.send('db connnection error', err);
                                                                                                                        } else {                       
                                                                                                                            const p = `select namereturn(USER_id) AS "username",rating,review,user_id from ENJOYS where CONTENT_ID=${id}`;
                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                if(e){
                                                                                                                                    res.send('other errors 3');
                                                                                                                                }
                                                                                                                                else {     
                                                                                                                                    reviews=r.rows;
                                                                                                                                    try {
                                                                                                                                        oracledb.getConnection(
                                                                                                                                            {
                                                                                                                                                user: 'c##test',
                                                                                                                                                password: 'test',
                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                            },
                                                                                                                                            (err, con) => {
                                                                                                                                                if (err) {
                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                } else {
                                                                                                                                                    if(type=='anime'){
                                                                                                                                                        var p = `select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,EPISODE_NO AS "EPISODE NO",STATUS,TO_CHAR(air_start_date, 'MON DD, YYYY' ) AS "AIR START DATE",TO_CHAR(air_end_date, 'MON DD, YYYY' ) AS "AIR END DATE",SEASON,PRODUCERS,LICENSORS,STUDIOS,SOURCE,GENRES,DURATION FROM CONTENTS JOIN ANIME ON CONTENTS.id=ANIME.id where CONTENTS.id='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='manga'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,chapters,STATUS,GENRES,AUTHORS_ARTISTS AS "AUTHORS & ARTISTS" from contents join manga on CONTENTS.id=MANGA.id where CONTENTS.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='lightnovel'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,TO_CHAR(PUBLISH_DATE, 'MON DD, YYYY' ) AS "PUBLISH DATE",STATUS,GENRES,AUTHORS from contents join lightnovel on contents.ID=LIGHTNOVEL.ID where contents.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                    else if(type=='movie'){
                                                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,TO_CHAR(release_date, 'MON DD, YYYY' ) AS "Release Date",PRODUCERS,LICENSORS,STUDIOS,SOURCE,DURATION from contents join movie on contents.ID=movie.ID where contents.ID='${id}'`;
                                                                                                                                                    }
                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                        if(e){
                                                                                                                                                            res.send('other errors');
                                                                                                                                                        }
                                                                                                                                                        else {
                                                                                                                                                            //console.log(r.metaData[0].name);
                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                            content=r;
                                                                                                                                                            for(let i=0;i<content.metaData.length;i++){
                                                                                                                                                                content.metaData[i].name=capitalizeFirstLetter(content.metaData[i].name);
                                                                                                                                                            }
                                                                                                                                                            // console.log(content);
                                                                                                                                                            try {
                                                                                                                                                                oracledb.getConnection(
                                                                                                                                                                    {
                                                                                                                                                                        user: 'c##test',
                                                                                                                                                                        password: 'test',
                                                                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                                                                    },
                                                                                                                                                                    (err, con) => {
                                                                                                                                                                        if (err) {
                                                                                                                                                                            res.send('db connnection error', err);
                                                                                                                                                                        } else {
                                                                                                                                                                            const p = `select CHARACTER_ID,name,character_list.type,url,description from contents join character_list on contents.ID=character_list.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                if(e){
                                                                                                                                                                                    res.send('other errors');
                                                                                                                                                                                }
                                                                                                                                                                                else {
                                                                                                                                                                                    //console.log(r.rows);
                                                                                                                                                                                    //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                    character=r.rows;
                                                                                                                                                                                    try {
                                                                                                                                                                                        oracledb.getConnection(
                                                                                                                                                                                            {
                                                                                                                                                                                                user: 'c##test',
                                                                                                                                                                                                password: 'test',
                                                                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                                                                            },
                                                                                                                                                                                            (err, con) => {
                                                                                                                                                                                                if (err) {
                                                                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    const p = `select links.type,link from contents join links on contents.ID=links.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                        if(e){
                                                                                                                                                                                                            res.send('other errors');
                                                                                                                                                                                                        }
                                                                                                                                                                                                        else {
                                                                                                                                                                                                            //console.log(r.rows);
                                                                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                            link=r.rows;
                                                                                                                                                                                                            if(content.rows[0][2]==null){
                                                                                                                                                                                                                source=null;
                                                                                                                                                                                                                // console.log(source);
                                                                                                                                                                                                                // console.log(watchlist,rate,reviews);
                                                                                                                                                                                                                res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,msg:msg,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                            }
                                                                                                                                                                                                            else{
                                                                                                                                                                                                                try {
                                                                                                                                                                                                                    oracledb.getConnection(
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            user: 'c##test',
                                                                                                                                                                                                                            password: 'test',
                                                                                                                                                                                                                            tns: 'localhost:1521/orcl'
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        (err, con) => {
                                                                                                                                                                                                                            if (err) {
                                                                                                                                                                                                                                res.send('db connnection error', err);
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                const p = `select title,type from contents where id='${content.rows[0][2]}'`;
                                                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                                                        res.send('other errors');
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    else {
                                                                                                                                                                                                                                        //console.log(r.rows);
                                                                                                                                                                                                                                        //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                                                        source=r.rows[0];
                                                                                                                                                                                                                                        // console.log(source);
                                                                                                                                                                                                                                        // console.log(watchlist,rate,reviews);
                                                                                                                                                                                                                                        res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,msg:msg,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    );
                                                                                                                                                                                                                } 
                                                                                                                                                                                                                catch (e) {
                                                                                                                                                                                                                    console.log(e);
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                            
                                                                                                                                                                                                        }
                                                                                                                                                                                                    });
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        );
                                                                                                                                                                                    } 
                                                                                                                                                                                    catch (e) {
                                                                                                                                                                                        console.log(e);
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                );
                                                                                                                                                            } 
                                                                                                                                                            catch (e) {
                                                                                                                                                                console.log(e);
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        );
                                                                                                                                    } 
                                                                                                                                    catch (e) {
                                                                                                                                        console.log(e);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }
                                                                                                                );
                                                                                                            } 
                                                                                                            catch (e) {
                                                                                                                console.log(e);
                                                                                                            }
                                                                                                        }
                                                                                                    });                          
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    } 
                                                                                    catch (e) {
                                                                                        console.log(e);
                                                                                    }
                                                                                    
                                                                                }
                                                                            });
                                                                        }
                                                                        else{
                                                                            try {
                                                                                oracledb.getConnection(
                                                                                    {
                                                                                        user: 'c##test',
                                                                                        password: 'test',
                                                                                        tns: 'localhost:1521/orcl'
                                                                                    },
                                                                                    (err, con) => {
                                                                                        if (err) {
                                                                                            res.send('db connnection error', err);
                                                                                        } else {                       
                                                                                            const p = `select namereturn(USER_id) AS "username",rating,review,user_id from ENJOYS where CONTENT_ID=${id}`;
                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                if(e){
                                                                                                    res.send('other errors 3');
                                                                                                }
                                                                                                else {     
                                                                                                    reviews=r.rows;
                                                                                                    try {
                                                                                                        oracledb.getConnection(
                                                                                                            {
                                                                                                                user: 'c##test',
                                                                                                                password: 'test',
                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                            },
                                                                                                            (err, con) => {
                                                                                                                if (err) {
                                                                                                                    res.send('db connnection error', err);
                                                                                                                } else {
                                                                                                                    if(type=='anime'){
                                                                                                                        var p = `select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,EPISODE_NO AS "EPISODE NO",STATUS,TO_CHAR(air_start_date, 'MON DD, YYYY' ) AS "AIR START DATE",TO_CHAR(air_end_date, 'MON DD, YYYY' ) AS "AIR END DATE",SEASON,PRODUCERS,LICENSORS,STUDIOS,SOURCE,GENRES,DURATION FROM CONTENTS JOIN ANIME ON CONTENTS.id=ANIME.id where CONTENTS.id='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='manga'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,chapters,STATUS,GENRES,AUTHORS_ARTISTS AS "AUTHORS & ARTISTS" from contents join manga on CONTENTS.id=MANGA.id where CONTENTS.ID='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='lightnovel'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,VOLUMES,TO_CHAR(PUBLISH_DATE, 'MON DD, YYYY' ) AS "PUBLISH DATE",STATUS,GENRES,AUTHORS from contents join lightnovel on contents.ID=LIGHTNOVEL.ID where contents.ID='${id}'`;
                                                                                                                    }
                                                                                                                    else if(type=='movie'){
                                                                                                                        var p=`select Title,type,SOURCE_ID AS "source id",COVER_PIC,SYNOPSIS,TO_CHAR(release_date, 'MON DD, YYYY' ) AS "Release Date",PRODUCERS,LICENSORS,STUDIOS,SOURCE,DURATION from contents join movie on contents.ID=movie.ID where contents.ID='${id}'`;
                                                                                                                    }
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                        if(e){
                                                                                                                            res.send('other errors');
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            //console.log(r.metaData[0].name);
                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                            content=r;
                                                                                                                            for(let i=0;i<content.metaData.length;i++){
                                                                                                                                content.metaData[i].name=capitalizeFirstLetter(content.metaData[i].name);
                                                                                                                            }
                                                                                                                            // console.log(content);
                                                                                                                            try {
                                                                                                                                oracledb.getConnection(
                                                                                                                                    {
                                                                                                                                        user: 'c##test',
                                                                                                                                        password: 'test',
                                                                                                                                        tns: 'localhost:1521/orcl'
                                                                                                                                    },
                                                                                                                                    (err, con) => {
                                                                                                                                        if (err) {
                                                                                                                                            res.send('db connnection error', err);
                                                                                                                                        } else {
                                                                                                                                            const p = `select CHARACTER_ID,name,character_list.type,url,description from contents join character_list on contents.ID=character_list.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                if(e){
                                                                                                                                                    res.send('other errors');
                                                                                                                                                }
                                                                                                                                                else {
                                                                                                                                                    //console.log(r.rows);
                                                                                                                                                    //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                    character=r.rows;
                                                                                                                                                    //console.log(character[0][4])
                                                                                                                                                    try {
                                                                                                                                                        oracledb.getConnection(
                                                                                                                                                            {
                                                                                                                                                                user: 'c##test',
                                                                                                                                                                password: 'test',
                                                                                                                                                                tns: 'localhost:1521/orcl'
                                                                                                                                                            },
                                                                                                                                                            (err, con) => {
                                                                                                                                                                if (err) {
                                                                                                                                                                    res.send('db connnection error', err);
                                                                                                                                                                } else {
                                                                                                                                                                    const p = `select links.type,link from contents join links on contents.ID=links.CONTENT_ID where contents.ID='${id}'`;
                                                                                                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                        if(e){
                                                                                                                                                                            res.send('other errors');
                                                                                                                                                                        }
                                                                                                                                                                        else {
                                                                                                                                                                            //console.log(r.rows);
                                                                                                                                                                            //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                            link=r.rows;
                                                                                                                                                                            if(content.rows[0][2]==null){
                                                                                                                                                                                source=null;
                                                                                                                                                                                //console.log(watchlist,rate,reviews);
                                                                                                                                                                                res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,msg:msg,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                            }
                                                                                                                                                                            else{
                                                                                                                                                                                try {
                                                                                                                                                                                    oracledb.getConnection(
                                                                                                                                                                                        {
                                                                                                                                                                                            user: 'c##test',
                                                                                                                                                                                            password: 'test',
                                                                                                                                                                                            tns: 'localhost:1521/orcl'
                                                                                                                                                                                        },
                                                                                                                                                                                        (err, con) => {
                                                                                                                                                                                            if (err) {
                                                                                                                                                                                                res.send('db connnection error', err);
                                                                                                                                                                                            } else {
                                                                                                                                                                                                const p = `select title,type from contents where id='${content.rows[0][2]}'`;
                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                        res.send('other errors');
                                                                                                                                                                                                    }
                                                                                                                                                                                                    else {
                                                                                                                                                                                                        //console.log(r.rows);
                                                                                                                                                                                                        //res.render('contents',{rows:r.rows[0]});
                                                                                                                                                                                                        source=r.rows[0];
                                                                                                                                                                                                        //console.log(source);
                                                                                                                                                                                                        //console.log(watchlist,rate,reviews);
                                                                                                                                                                                                        res.render('contents',{rows:content,rows2:character,rows3:link,source:source,id:id,type:type,watchlist:watchlist,rate:rate,reviews:reviews,msg:msg,rank:rank,username:req.session.user,admin:req.session.admin});
                                                                                                                                                                                                    }
                                                                                                                                                                                                });
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    );
                                                                                                                                                                                } 
                                                                                                                                                                                catch (e) {
                                                                                                                                                                                    console.log(e);
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            
                                                                                                                                                                        }
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        );
                                                                                                                                                    } 
                                                                                                                                                    catch (e) {
                                                                                                                                                        console.log(e);
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            } 
                                                                                                                            catch (e) {
                                                                                                                                console.log(e);
                                                                                                                            }
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            }
                                                                                                        );
                                                                                                    } 
                                                                                                    catch (e) {
                                                                                                        console.log(e);
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                );
                                                                            } 
                                                                            catch (e) {
                                                                                console.log(e);
                                                                            }
                                                                        }
                                                                        
                                                                    }
                                                                }
                                                            );
                                                        } 
                                                        catch (e) {
                                                            console.log(e);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            else{
                                res.render('notsubscribed',{username:req.session.user,admin:req.session.admin})
                            }
                        }
                    });
                }
            }
        );
    }
    catch (e) {
        console.log(e);
    }
    //console.log(content);console.log(character);console.log(link);
    
});



module.exports = router;