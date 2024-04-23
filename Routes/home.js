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

class Content {
    constructor(name, id, type) {
      this.name = name;
      this.id = id;
      this.type = type;
    }
}

router.get('/',(req,res)=>{
    // console.log(req.session.admin);
    var passedVariable = req.session.msg;
    var passedVariable2= req.session.user;
    req.session.msg='';
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
                    const q = `select * from contents where type='anime' ORDER BY id`;
                    con.execute(q, [], { autoCommit: true }, (e, r) => {
                        if (e)
                        {
                            res.send('error on');
                        } 
                        else{
                            try {
                                oracledb.getConnection(
                                    {
                                        user: 'c##test',
                                        password: 'test',
                                        tns: 'localhost:1521/orcl'
                                    },
                                    (err2, con2) => {
                                        if (err2) {
                                            res.send('db connnection error', err2);
                                        } else {
                                            const q2 = `select * from contents where type='manga' ORDER BY id`;
                                            con.execute(q2, [], { autoCommit: true }, (e2, r2) => {
                                                if (e2)
                                                {
                                                    res.send('error on');
                                                } 
                                                else{
                                                    //res.render('home',{id:r});
                                                    try {
                                                        oracledb.getConnection(
                                                            {
                                                                user: 'c##test',
                                                                password: 'test',
                                                                tns: 'localhost:1521/orcl'
                                                            },
                                                            (err3, con3) => {
                                                                if (err3) {
                                                                    res.send('db connnection error', err3);
                                                                } else {
                                                                    const q3 = `select * from contents where type='lightnovel' ORDER BY id`;
                                                                    con.execute(q3, [], { autoCommit: true }, (e3, r3) => {
                                                                        if (e3)
                                                                        {
                                                                            res.send('error on');
                                                                        } 
                                                                        else{
                                                                            //res.render('home',{id:r});
                                                                            try {
                                                                                oracledb.getConnection(
                                                                                    {
                                                                                        user: 'c##test',
                                                                                        password: 'test',
                                                                                        tns: 'localhost:1521/orcl'
                                                                                    },
                                                                                    (err4, con4) => {
                                                                                        if (err4) {
                                                                                            res.send('db connnection error', err4);
                                                                                        } else {
                                                                                            const q4 = `select * from contents where type='movie' ORDER BY id`;
                                                                                            con.execute(q4, [], { autoCommit: true }, (e4, r4) => {
                                                                                                if (e4)
                                                                                                {
                                                                                                    res.send('error on');
                                                                                                } 
                                                                                                else{
                                                                                                    res.render('home',{id:r,id2:r2,id3:r3,id4:r4,msg:passedVariable,username:passedVariable2,admin:req.session.admin});
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                );
                                                                            } 
                                                                            catch (e4) {
                                                                                console.log(e4);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    } 
                                                    catch (e3) {
                                                        console.log(e3);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                );
                            } 
                            catch (e2) {
                                console.log(e2);
                            }
                            //res.render('home',{id:r});
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }
});


router.get('/array',(req,res)=>{
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
                    const p = `select title,id,type from contents`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            const array=[];
                            for(let i=0;i<r.rows.length;i++) {
                                array[i]=new Content(r.rows[i][0],r.rows[i][1],r.rows[i][2]);
                            }
                            res.send({arr:array});
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

router.get('/logout',(req,res)=>{
    if(req.session.user){
        req.session.destroy(function(err){
            if(err){
                // console.log('Something wrong!!!')
                res.send(err);
            }
            else{
                // console.log('logout');
                res.redirect('/home');
            }
        });
    }
})
module.exports = router;