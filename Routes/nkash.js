const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');

const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
const bcrypt=require('bcrypt');

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
                        const p = `select * from nkash where user_id=${req.session.user_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.render('nkash',{array:r.rows[0],username:req.session.user,admin:req.session.admin});
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

router.post('/add',(req,res)=>{
    if(req.session.user){
        const {transactionID}=req.body;
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
                        const p = `insert into transactions(user_id,transaction) VALUES(${req.session.user_id},'${creator(transactionID)}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Added in the queue.You will get updates in the email',type:'success'})
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

router.post('/balanceadd/:user_id/:tid',(req,res)=>{
    if(req.session.user&& req.session.admin){
        const {amount}=req.body;
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
                        const p = `select addbalance(${amount},${req.params.user_id},${req.params.tid}) from dual`;
                        //console.log(p);
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                var bal = r.rows[0][0];
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
                                                const p = `select email from users where user_id=${req.params.user_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        var transporter = nodemailer.createTransport({
                                                            service: 'gmail',
                                                            host: 'smtp.gmail.com',
                                                            port: 465,      
                                                            secure: true, 
                                                            auth: {
                                                              user: process.env.GMAIL_USER,
                                                              pass: process.env.GMAIL_PASSWORD,
                                                            },
                                                            tls:{
                                                              rejectUnauthorized:false
                                                          }
                                                        });
                                                        transporter.sendMail({
                                                            to: r.rows[0][0],
                                                            subject:'Confirm Email',
                                                            html: `<!DOCTYPE html>
                                                            <html lang="en">
                                                            <head>
                                                                <meta charset="UTF-8">
                                                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                <title>Forgot password</title>
                                                            </head>
                                                            <body>
                                                                <p style="font-size:25px">Your requested balance has been added.your current balance is : ${bal} Live it up to power.</p>
                                                            </body>
                                                            </html>`
                                                        });
                                                        res.send({msg:'Balance added',type:'success'})
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

router.get('/delete/:tx_id',(req,res)=>{
    if(req.session.user&&req.session.admin){
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
                        const p = `delete from transactions where tx_id=${req.params.tx_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Transaction deleted successfully',type:'success'})
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

router.post('/update',(req,res)=>{
    if(req.session.user){
        const {pin,newpin}=req.body;
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
                        const p = `select pin from nkash where user_id=${req.session.user_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors1');
                            }
                            else {
                                bcrypt.compare(pin, r.rows[0][0]).then(function(result) {
                                    if(result){
                                        bcrypt.hash(newpin, parseInt(process.env.SALT)).then(function(hash) {
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
                                                            const p = `update nkash set pin='${creator(hash)}' where user_id=${req.session.user_id}`;
                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                if(e){
                                                                    console.log(e)
                                                                    res.send('other errors2');
                                                                }
                                                                else {
                                                                    res.send({msg:'Updated successfully',type:'success'});
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
                                    }
                                    else{
                                        res.send({msg:'Pin number does not match',type:'error'});
                                    }
                                });
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