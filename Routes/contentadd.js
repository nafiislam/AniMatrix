const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');

const multer=require("multer");
const path=require("path")


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/cover");
    },
    filename:(req,file,cb)=>{
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                                .replace(fileExt,"")
                                .toLowerCase()
                                .split(" ")
                                .join("-")+ "-" +Date.now();
        cb(null,fileName+fileExt);
    },
});

var upload=multer({ 
    storage:storage,
    limits:{
        fileSize:100000000//100mb
    },
    fileFilter:(req, file, cb)=>{
        if(file.mimetype==="image/jpeg"||file.mimetype==="image/png"||file.mimetype==="image/jpg"){
            cb(null,true);
        }else{
            cb(new Error("ONLY .jpg, .png, .jpeg formtas are allowed"))//cb(null,true); can also be used for silent file handling
        }
    },
});

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

function lcreator(st){
    if(st){
        s ='';
        for (let i=0;i<st.length;i++){
            if(st[i]=='\'')
                s+="''";
            else if(st[i]=='/')
                s+='//';
            else if(st[i]=='%')
                s+='/%';
            else if(st[i]=='_')
                s+='/_';
            else{
                s+=st[i];
            }
        }
        return s;
    }
    return st;
}

router.post('/anime',upload.single('cover_pic'),(req,res)=>{
    if(req.session.user){
        const {title,source_id_1,synopsis,lock,episode_no,status,air_start_date,air_end_date,season,producers,licensors,studios,source,genres,duration} =req.body
        var type='anime'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
        //console.log(lock)
        if(lock!='null'){
            locked='on'
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errorswhat');
                            }
                            else {
                                if(r.rows.length>0){
                                    source_id = r.rows[0][0];
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
                                                const p = `insert into contents(id,title,type,source_id,locked,cover_pic,synopsis) values(contentidreturner,'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e)
                                                        res.send('other errors1');
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
                                                                        const p = `insert into anime values((select max(id) from contents),'${episode_no}','${creator(status)}',TO_DATE('${air_start_date}','YYYY-MM-DD'),TO_DATE('${air_end_date}','YYYY-MM-DD'),'${creator(season)}','${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(genres)}','${creator(duration)}')`;
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
                                                                                                const p = `select max(id) from contents`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        var id=r.rows[0][0];
                                                                                                        console.log('content added')
                                                                                                        // res.redirect('/admindashboard?msg=4')
                                                                                                        res.send({msg:'Anime successfully added',id:id,image:cover_pic,title:title,synopsis:synopsis,episode_no:episode_no,locked:locked,studios:studios})
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

router.post('/manga',upload.single('cover_pic'),(req,res)=>{
    if(req.session.user){
        const {title,source_id_1,lock,synopsis,volumes,chapters,status,genres,authors_artists} =req.body
        var type='manga'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
        if(lock!='null'){
            locked='on'
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                if(r.rows.length>0){
                                    source_id = r.rows[0][0];
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
                                                                                                const p = `select max(id) from contents`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        var id=r.rows[0][0];
                                                                                                        console.log('content added')
                                                                                                        // res.redirect('/admindashboard?msg=4')
                                                                                                        res.send({msg:'Manga successfully added',id:id,title:title,image:cover_pic,status:status,genres:genres,authors_artists:authors_artists,synopsis:synopsis});
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

router.post('/lightnovel',upload.single('cover_pic'),(req,res)=>{
    if(req.session.user){
        const {title,source_id_1,lock,synopsis,volumes,publish_date,status,genres,authors} =req.body
        var type='lightnovel'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
        if(lock!='null'){
            locked='on'
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors1');
                            }
                            else {
                                if(r.rows.length>0){
                                    source_id = r.rows[0][0];
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
                                                                        const p = `insert into lightnovel values((select max(id) from contents),'${volumes}',TO_DATE('${publish_date}','YYYY-MM-DD'),'${creator(status)}','${creator(genres)}','${creator(authors)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                console.log(e)
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
                                                                                                        // res.redirect('/admindashboard?msg=4')
                                                                                                        res.send({msg:'Lightnovel successfully added',id:id,title:title,image:cover_pic,synopsis:synopsis,status:status,genres:genres,authors:authors})
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

router.post('/movie',upload.single('cover_pic'),(req,res)=>{
    if(req.session.user){
        const {title,source_id_1,lock,synopsis,release_date,producers,licensors,studios,source,duration} =req.body
        var type='movie'
        var cover_pic='/cover/'+req.file.filename;
        var locked = 'off';
        var source_id='';
        if(lock!='null'){
            locked='on'
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                if(r.rows.length>0){
                                    source_id = r.rows[0][0];
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
                                                                                console.log(e);
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
                                                                                                        // res.redirect('/admindashboard?msg=4')
                                                                                                        res.send({msg:'Movie successfully added',id:id,title:title,synopsis:synopsis,image:cover_pic,producers:producers,licensors:licensors,studios:studios,source:source});
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
module.exports = router;