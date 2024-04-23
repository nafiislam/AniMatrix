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
        const {title,source_id_1,synopsis,episode_no,status,air_start_date,air_end_date,season,producers,licensors,studios,source,genres,duration} =req.body
        var type='anime'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
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
                                if(r.rows.length>0)
                                    source_id = r.rows[0][0];
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
                                                var user_id;
                                                const p = `select user_id from users where username='${creator(req.session.user)}'`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        user_id = r.rows[0][0];
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
                                                                        const p = `insert into animerecommendations(user_id,title,type,source_id,locked,cover_pic,synopsis,episode_no,status,air_start_date,air_end_date,season,producers,licensors,studios,source,genres,duration) values(${user_id},'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}','${episode_no}','${creator(status)}',TO_DATE('${air_start_date}','YYYY-MM-DD'),TO_DATE('${air_end_date}','YYYY-MM-DD'),'${creator(season)}','${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(genres)}','${creator(duration)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                res.send('other errors');
                                                                            }
                                                                            else {
                                                                                console.log('content added')
                                                                                res.redirect(`/dashboard?msg=6`);
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
        const {title,source_id_1,synopsis,volumes,chapters,status,genres,authors_artists} =req.body
        var type='manga'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
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
                                if(r.rows.length>0)
                                    source_id = r.rows[0][0];
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
                                                    var user_id;
                                                    const p = `select user_id from users where username='${creator(req.session.user)}'`;
                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                        if(e){
                                                            res.send('other errors');
                                                        }
                                                        else {
                                                            user_id = r.rows[0][0];
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
                                                                            const p = `insert into mangarecommendations(user_id,title,type,source_id,locked,cover_pic,synopsis,volumes,chapters,status,genres,authors_artists) values(${user_id},'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}','${volumes}','${chapters}','${creator(status)}','${creator(genres)}','${creator(authors_artists)}')`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                        res.send('other errors');
                                                                                }
                                                                                else {
                                                                                    console.log('content added')
                                                                                    res.redirect(`/dashboard?msg=6`);
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
        const {title,source_id_1,synopsis,volumes,publish_date,status,genres,authors} =req.body
        var type='lightnovel'
        var cover_pic='/cover/'+req.file.filename;
        var source_id='';
        var locked = 'off';
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
                                if(r.rows.length>0)
                                    source_id = r.rows[0][0];
                                try {
                                    oracledb.getConnection(
                                        {
                                            user: 'c##test',
                                            password: 'test',
                                            tns: 'localhost:1521/orcl'
                                        },
                                        (err, con) => {
                                            if (err) {
                                                res.send('db connnection error2', err);
                                            } else {
                                                var user_id;
                                                const p = `select user_id from users where username='${creator(req.session.user)}'`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors3');
                                                    }
                                                    else {
                                                        user_id = r.rows[0][0];
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
                                                                        const p = `insert into lightnovelrecommendations(user_id,title,type,source_id,locked,cover_pic,synopsis,volumes,publish_date,status,genres,authors) values(${user_id},'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}','${volumes}',TO_DATE('${publish_date}','YYYY-MM-DD'),'${creator(status)}','${creator(genres)}','${creator(authors)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                console.log(e);
                                                                                    res.send('other errors4');
                                                                            }
                                                                            else {
                                                                                console.log('content added')
                                                                                res.redirect(`/dashboard?msg=6`);
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
        const {title,source_id_1,synopsis,release_date,producers,licensors,studios,source,duration} =req.body
        var type='movie'
        var cover_pic='/cover/'+req.file.filename;
        var locked = 'off';
        var source_id='';
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
                                if(r.rows.length>0)
                                    source_id = r.rows[0][0];
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
                                                var user_id;
                                                const p = `select user_id from users where username='${creator(req.session.user)}'`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        user_id = r.rows[0][0];
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
                                                                        const p = `insert into movierecommendations(user_id,title,type,source_id,locked,cover_pic,synopsis,release_date,producers,licensors,studios,source,duration) values(${user_id},'${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}',TO_DATE('${release_date}','YYYY-MM-DD'),'${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(duration)}')`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                    res.send('other errors');
                                                                            }
                                                                            else {
                                                                                console.log('content added')
                                                                                res.redirect(`/dashboard?msg=6`);
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