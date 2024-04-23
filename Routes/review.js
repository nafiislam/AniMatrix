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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

router.post('/rating',(req,res)=>{
    // ifconsole.log(req.body.rating);
    if(req.session.user){
        req.session.rating=req.body.rating;
        req.session.save();
    }
})
router.post('/update/:id/:type',(req,res)=>{
    if(req.session.user){
        // console.log('in post review 2'+req.session.rating);
        
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
                                                const p=`UPDATE enjoys set rating=${req.session.rating},review='${creator(req.body.review)}' where CONTENT_ID=${req.params.id} AND USER_ID=${userid}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('errors');
                                                    }
                                                    else {
                                                        res.redirect(`/contents/${req.params.id}/${req.params.type}/2`);
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
        res.redirect(`/contents/${req.params.id}/${req.params.type}/1`);
    } 
})
router.post('/:id/:type',(req,res)=>{
    if(req.session.user){
        // console.log('in post review 2'+req.session.rating);
        
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
                                                
                                                const p = `INSERT INTO enjoys VALUES('${userid}','${req.params.id}','${req.session.rating}','${creator(req.body.review)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            console.log(e);
                                                            res.send('errors');
                                                    }
                                                    else {
                                                        res.redirect(`/contents/${req.params.id}/${req.params.type}/2`);
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
        res.redirect(`/contents/${req.params.id}/${req.params.type}/1`);
    } 
})

router.get('/',(req,res)=>{
    
})




module.exports = router;