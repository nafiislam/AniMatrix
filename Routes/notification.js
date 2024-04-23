const express = require("express");
const router = express.Router();

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

router.get('/',(req,res)=>{
    if(req.session.user){
        res.render('notification',{username:req.session.user,admin:req.session.admin});
    }
    else{
        res.redirect('/users/login/failure');
    }
})


router.get('/seenall',(req,res)=>{
    if(req.session.user){
        console.log('i come')
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
                        const p = `update notification set status='seen'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({})
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

router.get('/get/:status',(req,res)=>{
    if(req.session.user){
        if(req.params.status!='all'){
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
                            const p = `select * from notification where user_id=${req.session.user_id} and status='${req.params.status}' order by time desc`;
                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                if(e){
                                    res.send('other errors');
                                }
                                else {
                                    res.send({array:r.rows})
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
                            const p = `select * from notification where user_id=${req.session.user_id} order by time desc`;
                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                if(e){
                                    res.send('other errors');
                                }
                                else {
                                    res.send({array:r.rows})
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
    else{
        res.redirect('/users/login/failure');
    }
})
router.get('/seen/:id',(req,res)=>{
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
                        const p = `update notification set status='seen' where id=${req.params.id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({})
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
router.post('/',(req,res)=>{
    if(req.session.user){
        const{type,refer_name,msg}=req.body;
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
                        const p = `insert into notification(user_id,refer_id,time,message,status,type) values(${req.session.user_id},idreturn('${creator(refer_name)}'),sysdate,'${creator(msg)}','unseen','${type}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                res.send({})
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