const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');
const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');

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
    res.render('forgot');
})

router.post('/email',(req,res)=>{
    const {username,email}=req.body;
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
                    const p = `select count(*) from users where username='${creator(username)}' and email='${creator(email)}'`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                            res.send('other errors');
                        }
                        else {
                            if(r.rows[0][0]!=0){
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
        
                                jwt.sign({
                                    user:username,email:email
                                },
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:'1h',
                                },
                                (err,emailToken)=>{
                                    //console.log(emailToken)
                                    const url =`http://localhost:3000/forgotpassword/newpassword/${emailToken}`;
                                    transporter.sendMail({
                                        to: email,
                                        subject:'Forgot password',
                                        html: `<!DOCTYPE html>
                                        <html lang="en">
                                        <head>
                                            <meta charset="UTF-8">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>Forgot password</title>
                                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
                                            <style>
                                            .button-24 {
                                                background: #FF4742;
                                                border: 1px solid #FF4742;
                                                border-radius: 6px;
                                                box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
                                                box-sizing: border-box;
                                                color: #FFFFFF;
                                                cursor: pointer;
                                                display: inline-block;
                                                font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
                                                font-size: 16px;
                                                font-weight: 800;
                                                line-height: 16px;
                                                min-height: 40px;
                                                outline: 0;
                                                padding: 12px 14px;
                                                text-align: center;
                                                text-rendering: geometricprecision;
                                                text-transform: none;
                                                user-select: none;
                                                -webkit-user-select: none;
                                                touch-action: manipulation;
                                                vertical-align: middle;
                                              }
                                              
                                              .button-24:hover,
                                              .button-24:active {
                                                background-color: initial;
                                                background-position: 0 0;
                                                color: #FF4742;
                                              }
                                              
                                              .button-24:active {
                                                opacity: .5;
                                              }
                                            </style>
                                        </head>
                                        <body>
                                            <div class="row">
                                                <img src="http://drive.google.com/uc?export=view&id=11d1JZCNOu-B69BjTYC1MjwEIhDJr5bUm" class="img-thumbnail mx-auto my-auto" style="width:800px;height:600px;align-items:center">
                                            </div>
                                            <div class="row">
                                                <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to reset</button></a>
                                                <p style="margin: auto;padding: 10px; font-size: 20px;">Please click this to reset your password: <a href="${url}">${url}</a></p>
                                            </div>
                                            <script
                                            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                            crossorigin="anonymous"
                                            ></script>
                                        </body>
                                        </html>`,
                                    }); 
                                }
                                );                        
                                res.send({msg:'An email has been sent to your email address',type:'success'})
                            }
                            else{
                                res.send({msg:'You have given incorrect information',type:'error'})
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

router.get('/newpassword/:token',(req,res)=>{
    try{
        const{user,email}=jwt.verify(req.params.token,process.env.JWT_SECRET);
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
                        const p = `select count(*) from users where username='${creator(user)}' and email='${creator(email)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                if(r.rows[0][0]!=0){
                                    res.render('newpassword');
                                }
                                else{
                                    res.send('Go way from my site');
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
    }catch (e) {
        res.send('Go way from my site');
    }
})

router.post('/password/:token',(req,res)=> {
    try{
        var{user,email}=jwt.verify(req.params.token,process.env.JWT_SECRET);
        var {password}=req.body;
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
                        const p = `select count(*) from users where username='${creator(user)}' and email='${creator(email)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                if(r.rows[0][0]!=0){
                                    password=jwt.sign({password:password,},process.env.JWT_PASS_SECRET);
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
                                                    const p = `update users set password = '${creator(password)}' where username='${creator(user)}'`;
                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                        if(e){
                                                            res.send('other errors');
                                                        }
                                                        else {
                                                            res.send({msg:'Your password has been reset sucessfully',type:'success'})
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
                                    res.send({msg:'Wrong authorization',type:'error'})
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
    }catch (e) {
        res.send({msg:'Wrong authorization',type:'error'})
    }
})

module.exports = router;