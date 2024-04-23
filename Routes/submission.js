const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');
const fs=require('fs')
const multer=require("multer");
const path=require("path")

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


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/submission");
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
});


router.post('/add/:user_id',upload.single('subfile'),(req,res)=>{
    if(req.session.user){
        var user_id =req.params.user_id;
        const location='./public/submission/'+req.file.filename;
        const {title,type,description}=req.body;
        //file_id,title,type,description,location,user_id
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
                        const p = `insert into SUBMISSIONS(title,type,description,location,user_id) values('${creator(title)}', '${type}','${creator(description)}','${creator(location)}','${user_id}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                res.redirect(`/dashboard?msg=5`);
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
});

router.get('/delete/:file_id',(req,res)=>{
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
                        const p = `select location from submissions where file_id=${req.params.file_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath=r.rows[0][0];
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
                                                const p = `delete from submissions where file_id=${req.params.file_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        // res.redirect('/admindashboard?msg=3')
                                                        res.send({msg:'Successfully deleted submission'})
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

router.get('/download/:file_id',(req,res)=>{
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
                        const p = `select location from submissions where file_id=${req.params.file_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.download(r.rows[0][0])
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

router.get('/',(req,res)=>{
    if(req.session.user){
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
                        const p = `select isSubscribed(${req.session.user_id}) from dual`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors1');
                            }
                            else {
                                if(r.rows[0][0]=='true'){
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
                                                    const p = `select * from submissions`;
                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                        if(e){
                                                            res.send('other errors2');
                                                        }
                                                        else {
                                                            res.render('submission',{username:req.session.user,admin:req.session.admin,submission:r.rows})
                                                        }
                                                    });
                                                }
                                            }
                                        );
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }                            
                                }else{
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
    }
    else{
        res.redirect('/users/login/failure');
    }
})

module.exports = router;