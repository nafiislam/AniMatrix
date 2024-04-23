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

router.get('/anime',(req,res)=>{
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
                    const p = `select id,title,type,source_id,locked,cover_pic,synopsis,topwatch(id) from contents where type = 'anime' order by topwatch(id) DESC NULLS LAST`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            // console.log(r.rows[0]);
                            res.render('topranked',{array:r.rows,username:req.session.user,admin:req.session.admin});
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }
})

router.get('/manga',(req,res)=>{
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
                    const p = `select id,title,type,source_id,locked,cover_pic,synopsis,topwatch(id) from contents where type = 'manga' order by topwatch(id) DESC NULLS LAST`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            res.render('topranked',{array:r.rows,username:req.session.user,admin:req.session.admin});
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }
})

router.get('/lightnovel',(req,res)=>{
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
                    const p = `select id,title,type,source_id,locked,cover_pic,synopsis,topwatch(id) from contents where type = 'lightnovel' order by topwatch(id) DESC NULLS LAST`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            res.render('topranked',{array:r.rows,username:req.session.user,admin:req.session.admin});
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }
})

router.get('/movie',(req,res)=>{
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
                    const p = `select id,title,type,source_id,locked,cover_pic,synopsis,topwatch(id) from contents where type = 'movie' order by topwatch(id) DESC NULLS LAST`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            res.render('topranked',{array:r.rows,username:req.session.user,admin:req.session.admin});
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }
})


module.exports = router;