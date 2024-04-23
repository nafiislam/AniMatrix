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


router.get('/',(req,res)=>{
    if(req.session.user && req.session.admin){
        var msg;
        if(req.query.msg){
            msg=req.query.msg;
        }
        var reports,transactions,userlist,anime,manga,lightnovel,movie,animerecom,mangarecom,lightnovelrecom,movierecom,title,submission;
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
                        const p = `select * from report`;
                        con.execute(p, [], { autoCommit: true }, (ew, rw) => {
                            if(ew){
                                res.send('other errors');
                            }
                            else {
                                reports=rw.rows;
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
                                                const p = `select tx_id,username,transaction,user_id from users natural join transactions`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        transactions=r.rows;
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
                                                                        const p = `select title from contents`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                res.send('other errors');
                                                                            }
                                                                            else {
                                                                                title = r.rows;
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
                                                                                                const p = `select * from animerecommendations order by recom_id`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        animerecom=r.rows;
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
                                                                                                                        const p = `select * from mangarecommendations order by recom_id`;
                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                            if(e){
                                                                                                                                res.send('other errors');
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                mangarecom=r.rows;
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
                                                                                                                                                const p = `select * from lightnovelrecommendations order by recom_id`;
                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                    if(e){
                                                                                                                                                        res.send('other errors');
                                                                                                                                                    }
                                                                                                                                                    else {
                                                                                                                                                        lightnovelrecom=r.rows;
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
                                                                                                                                                                        const p = `select * from movierecommendations order by recom_id`;
                                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                            if(e){
                                                                                                                                                                                res.send('other errors');
                                                                                                                                                                            }
                                                                                                                                                                            else {
                                                                                                                                                                                movierecom=r.rows;
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
                                                                                                                                                                                                const p = `select * from submissions order by file_id`;
                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                        res.send('other errors');
                                                                                                                                                                                                    }
                                                                                                                                                                                                    else {
                                                                                                                                                                                                        submission=r.rows;
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
                                                                                                                                                                                                                        const p = `select user_id,email,password,username,profile_pic,country,TO_CHAR(joined, 'DD-MON-YYYY' ),TO_CHAR(birthday, 'DD-MON-YYYY' ),gender,type,agereturn(user_id) from users where type='user' order by user_id`;
                                                                                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                            if(e){
                                                                                                                                                                                                                                console.log(e);
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            else {
                                                                                                                                                                                                                                userlist=r.rows;
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
                                                                                                                                                                                                                                                const p = `SELECT * FROM CONTENTS JOIN ANIME ON CONTENTS.id=ANIME.id order by CONTENTS.id`;
                                                                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                                                                        console.log(e);
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    else {
                                                                                                                                                                                                                                                        anime=r.rows;
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
                                                                                                                                                                                                                                                                        const p = `SELECT * FROM CONTENTS JOIN MANGA ON CONTENTS.id=MANGA.id order by CONTENTS.id`;
                                                                                                                                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                                                            if(e){
                                                                                                                                                                                                                                                                                console.log(e);
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                            else {
                                                                                                                                                                                                                                                                                manga=r.rows;
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
                                                                                                                                                                                                                                                                                                const p = `SELECT * FROM CONTENTS JOIN LIGHTNOVEL ON CONTENTS.id=LIGHTNOVEL.id order by CONTENTS.id`;
                                                                                                                                                                                                                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                                                                                    if(e){
                                                                                                                                                                                                                                                                                                        console.log(e);
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                    else {
                                                                                                                                                                                                                                                                                                        lightnovel=r.rows;
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
                                                                                                                                                                                                                                                                                                                        const p = `SELECT * FROM CONTENTS JOIN MOVIE ON CONTENTS.id=MOVIE.id order by CONTENTS.id`;
                                                                                                                                                                                                                                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                                                                                                                                                                                                                                            if(e){
                                                                                                                                                                                                                                                                                                                                console.log(e);
                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                            else {
                                                                                                                                                                                                                                                                                                                                // console.log(r.rows[0]);
                                                                                                                                                                                                                                                                                                                                movie=r.rows;
                                                                                                                                                                                                                                                                                                                                res.render('admindashboard',{userlist:userlist,anime:anime,manga:manga,lightnovel:lightnovel,movie:movie,msg:msg,title:title,animerecom:animerecom,mangarecom:mangarecom,lightnovelrecom:lightnovelrecom,movierecom:movierecom,submission:submission,transactions:transactions,reports:reports});
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
    //res.render('admindashboard');
})

router.get('/delete',(req,res)=>{
    if(req.session.user&&req.session.admin){
        var userId=req.query.id;
        //console.log(userId);
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
                        const p = `select profile_pic from users where user_id=${userId}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                const filePath='./public/'+r.rows[0][0];
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
                                                const p = `delete from users where user_id=${userId}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e);
                                                    }
                                                    else {
                                                        res.send({msg:'Successfully deleted user'})
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

router.get('/contentdelete',(req,res)=>{
   if(req.session.user&&req.session.admin){
        var contentId=req.query.id;
        //console.log(userId);
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
                        const p = `select cover_pic from contents where id=${contentId}`;
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
                                                const p = `delete from contents where id=${contentId}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e);
                                                    }
                                                    else {
                                                        //res.redirect('/admindashboard?msg=2')
                                                        //console.log("aschi")
                                                        res.send({msg:'Successfully deleted content'})
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