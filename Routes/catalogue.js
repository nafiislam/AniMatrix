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
        //console.log(req.session.user_id);
        var user_id,readinglist,watchlist;
        var msg;
        if(req.query.msg){
            msg=req.query.msg;
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
                        const p = `select user_id from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                user_id=r.rows[0][0];
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
                                                const p = `select user_id,CONTENT_ID,status,type,title,cover_pic  from WATCH_LIST join CONTENTS on id=CONTENT_ID where (type ='anime' OR type='movie') AND USER_ID=${user_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        watchlist=r.rows
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
                                                                        const p = `select user_id,CONTENT_ID,status,type,title,cover_pic from WATCH_LIST join CONTENTS on id=CONTENT_ID where (type ='manga' OR type='lightnovel')AND USER_ID=${user_id}`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                res.send('other errors');
                                                                            }
                                                                            else {
                                                                                readinglist=r.rows;
                                                                                res.render('catalogue',{readinglist:readinglist,watchlist:watchlist,username:req.session.user,admin:req.session.admin,msg:msg});
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

router.post('/update/:user_id/:content_id',(req,res)=>{
    if(req.session.user){
        const {status}=req.body;
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
                        const p = `update watch_list set status='${status}' where user_id=${req.params.user_id} AND content_id=${req.params.content_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.redirect('/catalogue?msg=1');
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

router.get('/delete/:user_id/:content_id',(req,res)=>{
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
                        const p = `delete from watch_list where user_id=${req.params.user_id} AND content_id=${req.params.content_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.redirect('/catalogue?msg=2');
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