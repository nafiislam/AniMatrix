const express = require("express");
const router = express.Router();
const fs=require('fs')

const oracledb = require('oracledb');

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

router.post('/anime/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
        var title,type,source_id,locked,cover_pic,synopsis,episode_no,status,air_start_date,air_end_date,season,producers,licensors,studios,source,genres,duration
        console.log(typeof req.body.lock)
        if(req.body.lock){
            locked='on';
        }
        console.log(req.body.lock)
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
                        const p = `select user_id,recom_id,title,type,source_id,locked,cover_pic,synopsis,episode_no,status,TO_CHAR(air_start_date,'YYYY-MM-DD' ),TO_CHAR(air_end_date,'YYYY-MM-DD' ),season,producers,licensors,studios,source,genres,duration from animerecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors1');
                            }
                            else {
                                title = r.rows[0][2] ? r.rows[0][2]:''
                                type=r.rows[0][3] ? r.rows[0][3]:''
                                source_id=r.rows[0][4] ? r.rows[0][4]:''
                                locked= locked ? locked : r.rows[0][5]
                                cover_pic=r.rows[0][6] ? r.rows[0][6]:''
                                synopsis=r.rows[0][7] ? r.rows[0][7]:''
                                episode_no=r.rows[0][8] ? r.rows[0][8]:''
                                status=r.rows[0][9] ? r.rows[0][9]:''
                                air_start_date=r.rows[0][10] ? r.rows[0][10]:''
                                air_end_date=r.rows[0][11] ? r.rows[0][11]:''
                                season=r.rows[0][12] ? r.rows[0][12]:''
                                producers=r.rows[0][13] ? r.rows[0][13]:''
                                licensors=r.rows[0][14] ? r.rows[0][14]:''
                                studios=r.rows[0][15] ? r.rows[0][15]:''
                                source=r.rows[0][16] ? r.rows[0][16]:''
                                genres=r.rows[0][17] ? r.rows[0][17]:''
                                duration=r.rows[0][18] ? r.rows[0][18]:''
                                //console.log(typeof(air_end_date+''))
                                //console.log(air_end_date)

                                // console.log(typeof(episode_no));
                                // console.log(typeof(parseInt(episode_no)));
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
                                                const p = `insert into contents(id,title,type,source_id,locked,cover_pic,synopsis) values(contentidreturner,'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e)
                                                        res.send('other errors2');
                                                    }
                                                    else {
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
                                                                        const p = `insert into anime values((select max(id) from contents),'${(episode_no)}','${creator(status)}',TO_DATE('${air_start_date}','YYYY-MM-DD'),TO_DATE('${air_end_date}','YYYY-MM-DD'),'${creator(season)}','${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(genres)}','${creator(duration)}')`;
                                                                        //console.log(p)
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                console.log(e)
                                                                                res.send('other errors3');
                                                                            }
                                                                            else {
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
                                                                                                const p = `select max(id) from contents`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        var id=r.rows[0][0];
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
                                                                                                                        const p = `delete from animerecommendations where recom_id=${req.params.recom_id}`;
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                            if(e){
                                                                                                                                res.send('other errors');
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                console.log('content added')
                                                                                                                                // res.redirect('/admindashboard?msg=6')
                                                                                                                                res.send({msg:'Anime recommendation successfully added',id:id,image:cover_pic,title:title,synopsis:synopsis,episode_no:episode_no,locked:locked,studios:studios});
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.post('/manga/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
        var title,type,source_id,locked,cover_pic,synopsis,volumes,chapters,status,genres,authors_artists
        if(req.body.lock){
            locked='on';
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
                        const p = `select * from mangarecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                title = r.rows[0][2] ? r.rows[0][2]:''
                                type=r.rows[0][3] ? r.rows[0][3]:''
                                source_id=r.rows[0][4] ? r.rows[0][4]:''
                                locked= locked ? locked : r.rows[0][5]
                                cover_pic=r.rows[0][6] ? r.rows[0][6]:''
                                synopsis=r.rows[0][7] ? r.rows[0][7]:''
                                volumes=r.rows[0][8] ? r.rows[0][8]:''
                                chapters=r.rows[0][9] ? r.rows[0][9]:''
                                status=r.rows[0][10] ? r.rows[0][10]:''
                                genres=r.rows[0][11] ? r.rows[0][11]:''
                                authors_artists=r.rows[0][12] ? r.rows[0][12]:''
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
                                                const p = `insert into contents(id,title,type,source_id,locked,cover_pic,synopsis) values(contentidreturner,'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
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
                                                                        const p = `insert into manga values((select max(id) from contents),'${volumes}','${chapters}','${creator(status)}','${creator(genres)}','${creator(authors_artists)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                    res.send('other errors');
                                                                            }
                                                                            else {
                                                                                
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
                                                                                                const p = `delete from mangarecommendations where recom_id=${req.params.recom_id}`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                            res.send('other errors');
                                                                                                    }
                                                                                                    else {
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
                                                                                                                        const p = `select max(id) from contents`;
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                            if(e){
                                                                                                                                res.send('other errors');
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                var id=r.rows[0][0];
                                                                                                                                console.log('content added')
                                                                                                                                // res.redirect('/admindashboard?msg=6')
                                                                                                                                res.send({msg:'Manga recommendation successfully added',id:id,title:title,image:cover_pic,status:status,genres:genres,authors_artists:authors_artists,synopsis:synopsis});
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.post('/lightnovel/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
        var title='',type='',source_id='',locked='',cover_pic='',synopsis='',volumes='',publish_date='',status='',genres='',authors=''
        if(req.body.lock){
            locked='on';
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
                        const p = `select user_id,recom_id,title,type,source_id,locked,cover_pic,synopsis,volumes,TO_CHAR(publish_date,'YYYY-MM-DD'),status,genres,authors from lightnovelrecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors1');
                            }
                            else {
                                title = r.rows[0][2] ? r.rows[0][2]:''
                                type=r.rows[0][3] ? r.rows[0][3]:''
                                source_id=r.rows[0][4] ? r.rows[0][4]:''
                                locked= locked ? locked : r.rows[0][5]
                                cover_pic=r.rows[0][6] ? r.rows[0][6]:''
                                synopsis=r.rows[0][7] ? r.rows[0][7]:''
                                volumes=r.rows[0][8] ? r.rows[0][8]:''
                                publish_date=r.rows[0][9] ? r.rows[0][9]:''
                                status=r.rows[0][10] ? r.rows[0][10]:''
                                genres=r.rows[0][11] ? r.rows[0][11]:''
                                authors=r.rows[0][12] ? r.rows[0][12]:''
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
                                                const p = `insert into contents(id,title,type,source_id,locked,cover_pic,synopsis) values(contentidreturner,'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e)
                                                        res.send('other errors2');
                                                    }
                                                    else {
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
                                                                        const p = `insert into lightnovel values((select max(id) from contents),'${volumes}',TO_DATE('${publish_date}','YYYY-MM-DD'),'${creator(status)}','${creator(genres)}','${creator(authors)}')`;
                                                                        //console.log(p)
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                console.log(e)
                                                                                res.send('other errors3');
                                                                            }
                                                                            else {
                                                                                
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
                                                                                                const p = `delete from lightnovelrecommendations where recom_id=${req.params.recom_id}`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        console.log(e)
                                                                                                        res.send('other errors4');
                                                                                                    }
                                                                                                    else {
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
                                                                                                                        const p = `select max(id) from contents`;
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                            if(e){
                                                                                                                                res.send('other errors');
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                var id=r.rows[0][0];
                                                                                                                                console.log('content added')
                                                                                                                                // res.redirect('/admindashboard?msg=6')
                                                                                                                                res.send({msg:'Lightnovel recommendation successfully added',id:id,title:title,image:cover_pic,synopsis:synopsis,status:status,genres:genres,authors:authors})
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.post('/movie/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
        var title,type,source_id,locked,cover_pic,synopsis,release_date,producers,licensors,studios,source,duration
        if(req.body.lock){
            locked='on';
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
                        const p = `select user_id,recom_id,title,type,source_id,locked,cover_pic,synopsis,TO_CHAR(release_date,'YYYY-MM-DD'),producers,licensors,studios,source,duration from movierecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                title = r.rows[0][2] ? r.rows[0][2]:''
                                type=r.rows[0][3] ? r.rows[0][3]:''
                                source_id=r.rows[0][4] ? r.rows[0][4]:''
                                locked= locked ? locked : r.rows[0][5]
                                cover_pic=r.rows[0][6] ? r.rows[0][6]:''
                                synopsis=r.rows[0][7] ? r.rows[0][7]:''
                                release_date=r.rows[0][8] ? r.rows[0][8]:''
                                producers=r.rows[0][9] ? r.rows[0][9]:''
                                licensors=r.rows[0][10] ? r.rows[0][10]:''
                                studios=r.rows[0][11] ? r.rows[0][11]:''
                                source=r.rows[0][12] ? r.rows[0][12]:''
                                duration=r.rows[0][13] ? r.rows[0][13]:''
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
                                                const p = `insert into contents(id,title,type,source_id,locked,cover_pic,synopsis) values(contentidreturner,'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
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
                                                                        const p = `insert into movie values((select max(id) from contents),TO_DATE('${release_date}','YYYY-MM-DD'),'${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(duration)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                    res.send('other errors');
                                                                            }
                                                                            else {
                                                                                
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
                                                                                                const p = `delete from movierecommendations where recom_id=${req.params.recom_id}`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
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
                                                                                                                        const p = `select max(id) from contents`;
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                            if(e){
                                                                                                                                res.send('other errors');
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                var id=r.rows[0][0];
                                                                                                                                console.log('content added')
                                                                                                                                // res.redirect('/admindashboard?msg=6')
                                                                                                                                res.send({msg:'Movie recommendation successfully added',id:id,title:title,synopsis:synopsis,image:cover_pic,producers:producers,licensors:licensors,studios:studios,source:source});
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.get('/anime/delete/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
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
                        const p = `select cover_pic from animerecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath='./public'+r.rows[0][0];
                                try{
                                    fs.unlinkSync(filePath);
                                    console.log('success in deleting file');
                                }
                                catch(err){
                                    console.log('Failure in deleting')
                                    console.log(err.message)
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
                                                const p = `delete from animerecommendations where recom_id=${req.params.recom_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        // res.redirect('/admindashboard?msg=5')
                                                        res.send({msg:'Anime recommendation successfully deleted'})
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.get('/manga/delete/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
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
                        const p = `select cover_pic from mangarecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath='./public'+r.rows[0][0];
                                try{
                                    fs.unlinkSync(filePath);
                                    console.log('success in deleting file');
                                }
                                catch(err){
                                    console.log('Failure in deleting')
                                    console.log(err.message)
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
                                                const p = `delete from mangarecommendations where recom_id=${req.params.recom_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        // res.redirect('/admindashboard?msg=5')
                                                        res.send({msg:'Manga recommendation successfully deleted'})
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.get('/lightnovel/delete/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
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
                        const p = `select cover_pic from lightnovelrecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath='./public'+r.rows[0][0];
                                try{
                                    fs.unlinkSync(filePath);
                                    console.log('success in deleting file');
                                }
                                catch(err){
                                    console.log('Failure in deleting')
                                    console.log(err.message)
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
                                                const p = `delete from lightnovelrecommendations where recom_id=${req.params.recom_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        // res.redirect('/admindashboard?msg=5')
                                                        res.send({msg:'Lightnovel recommendation successfully deleted'})
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
    else{
        res.redirect('/users/login/failure');
    }
})

router.get('/movie/delete/:recom_id',(req,res)=>{
    if(req.session.user && req.session.admin){
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
                        const p = `select cover_pic from movierecommendations where recom_id=${req.params.recom_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath='./public'+r.rows[0][0];
                                try{
                                    fs.unlinkSync(filePath);
                                    console.log('success in deleting file');
                                }
                                catch(err){
                                    console.log('Failure in deleting')
                                    console.log(err.message)
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
                                                const p = `delete from movierecommendations where recom_id=${req.params.recom_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else{
                                                        // res.redirect('/admindashboard?msg=5')
                                                        res.send({msg:'Movie recommendation successfully deleted'})
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
    else{
        res.redirect('/users/login/failure');
    }
})

module.exports = router;