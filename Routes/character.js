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


router.get('/:id/:type/:charId',(req,res)=>{
    //console.log(req.body);
    var character,contentname,rate,reviews;
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
                    const p = `SELECT namereturn(user_id),rating,review FROM CHARACTER_RATING WHERE character_id=${req.params.charId}`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                            res.send('other errors');
                        }
                        else {
                            // console.log(r.rows);
                            // var reviews=[];
                            // if(r.rows.length>0){
                            //     reviews=r.rows;
                            // }
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
                                            const p = `select * from character_list where character_id=${req.params.charId}`;
                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                if(e){
                                                        res.send('other errors');
                                                }
                                                else {
                                                    character=r.rows[0];
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
                                                                    const p = `select title from contents where id=${req.params.id}`;
                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                        if(e){
                                                                                res.send('other errors');
                                                                        }
                                                                        else {
                                                                            contentname=r.rows[0][0];
                                                                            //console.log(character,contentname);
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
                                                                                                const p = `select rating from CHARACTER_RATING where USER_ID=idreturn('${creator(req.session.user)}') AND CHARACTER_ID=${req.params.charId}`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                            res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        if(r.rows.length>0)
                                                                                                            rate=r.rows[0][0];
                                                                                                            res.render('character',{username:req.session.user,id:req.params.id,type:req.params.type,charId:req.params.charId,character:character,contentname:contentname,rate:rate,admin:req.session.admin,reviews:reviews});
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
                                                                                res.render('character',{username:req.session.user,id:req.params.id,type:req.params.type,charId:req.params.charId,character:character,contentname:contentname,admin:req.session.admin,reviews:reviews});
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
})

router.post('/rating',(req,res)=>{
    //console.log(req.body);
    if(req.session.user){
        //console.log(req.session.user);
        req.session.charrating=req.body.rating;
        req.session.save()
    }
})

router.post('/review/:id/:type/:charId',(req,res)=>{
    if(req.session.user){
        // console.log('in post review 2'+req.session.charrating);
        
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
                        // console.log(req.session.user);
                        const p = `SELECT user_id from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e);
                                res.send('other errors');
                            }
                            else {
                                var userid=r.rows[0][0];
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
                                                //review = req.body.review.replace("'","''")
                                                const p = `INSERT INTO character_rating VALUES('${userid}','${req.params.charId}','${req.session.charrating}','${creator(req.body.review)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e);
                                                        res.send('errors');
                                                    }
                                                    else {
                                                        res.redirect(`/character/${req.params.id}/${req.params.type}/${req.params.charId}/1`);
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
        res.redirect(`/character/${req.params.id}/${req.params.type}/${req.params.charId}/2`);
    } 
})


router.post('/review/update/:id/:type/:charId',(req,res)=>{
    if(req.session.user){
        // console.log('in post review 2'+req.session.charrating);
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
                        // console.log(req.session.user);
                        const p = `SELECT user_id from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e);
                                res.send('other errors');
                            }
                            else {
                                var userid=r.rows[0][0];
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
                                                // console.log(typeof req.body.review);
                                                // review=''
                                                // for (let i=0;i<req.body.review.length;i++){
                                                //     if(req.body.review[i]=='\'')
                                                //         review+="''";
                                                //     else{
                                                //         review+=req.body.review[i];
                                                //     }
                                                // }
            
                                                // console.log(review);
                                                const p = `UPDATE character_rating set rating=${req.session.charrating},review='${creator(req.body.review)}' where CHARACTER_ID=${req.params.charId} AND USER_ID=${userid}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e);
                                                        res.send('errors');
                                                    }
                                                    else {
                                                        res.redirect(`/character/${req.params.id}/${req.params.type}/${req.params.charId}/3`);
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
        res.redirect(`/character/${req.params.id}/${req.params.type}/${req.params.charId}/2`);
    } 
})
router.get('/',(req,res)=>{
    
})

router.get('/:id/:type/:charId/:msg',(req,res)=>{
    //console.log(req.body);
    var character,contentname,rate,reviews;
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
                    const p = `SELECT namereturn(user_id),rating,review FROM CHARACTER_RATING WHERE character_id=${req.params.charId}`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                            res.send('other errors');
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
                                            const p = `select * from character_list where character_id=${req.params.charId}`;
                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                if(e){
                                                        res.send('other errors');
                                                }
                                                else {
                                                    character=r.rows[0];
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
                                                                    const p = `select title from contents where id=${req.params.id}`;
                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                        if(e){
                                                                            res.send('other errors');
                                                                        }
                                                                        else {
                                                                            contentname=r.rows[0][0];
                                                                            //console.log(character,contentname);
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
                                                                                                const p = `select rating from CHARACTER_RATING where USER_ID=idreturn('${creator(req.session.user)}') AND CHARACTER_ID=${req.params.charId}`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                            res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        if(r.rows.length>0)
                                                                                                            rate=r.rows[0][0];
                                                                                                        res.render('character',{username:req.session.user,id:req.params.id,type:req.params.type,charId:req.params.charId,character:character,contentname:contentname,rate:rate,msg:req.params.msg,admin:req.session.admin,reviews:reviews});
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
                                                                                res.render('character',{username:req.session.user,id:req.params.id,type:req.params.type,charId:req.params.charId,character:character,contentname:contentname,msg:req.params.msg,admin:req.session.admin,reviews:reviews});
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
})

module.exports = router;