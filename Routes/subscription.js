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
                        const p = `select count(*) from trial where user_id=${req.session.user_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                if(r.rows[0][0]==0){
                                    res.render('buySubscription',{trial:true,username:req.session.user,admin:req.session.admin})
                                }
                                else{
                                    res.render('buySubscription',{trial:false,username:req.session.user,admin:req.session.admin})
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

router.get('/trial',(req,res)=>{
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
                        const p = `insert into trial values(${req.session.user_id})`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
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
                                                const p = `select subscribe(7,${s=req.session.user_id},0) from dual`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        // res.redirect('/subscription');
                                                        res.send({msg:'You have been successfully registered',type:'success',enddate:r.rows[0][0]});
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

router.get('/proceed/:price/:pack',(req,res)=>{
    if(req.session.user){
        res.render('proceedSubscription',{username:req.session.user,admin:req.session.admin,price:req.params.price,pack:req.params.pack})
    }
    else{
        res.redirect('/users/login/failure');
    }
})

router.post('/otp',async (req,res)=>{
    if(req.session.user){
        const otp=Math.floor(100000 + Math.random() * 900000);
        const hashedotp = await bcrypt.hash(otp+'',parseInt(process.env.SALT));
        const{email,password}=req.body;
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
                        const p = `select email,password from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                if(r.rows[0][0]==email){
                                    var decoded = jwt.verify(r.rows[0][1],process.env.JWT_PASS_SECRET);
                                    if(decoded.password==password){
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
                                            otp:hashedotp
                                        },
                                        process.env.JWT_OTP_SECRET,
                                        {
                                            expiresIn:5*60,
                                        },
                                        (err,Token)=>{
                                            //console.log(Token);
                                            req.session.otp=Token;
                                            req.session.save();
                                            transporter.sendMail({
                                                to: email,
                                                subject:'OTP',
                                                html: `<!DOCTYPE html>
                                                <html lang="en">
                                                <head>
                                                    <meta charset="UTF-8">
                                                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <title>Forgot password</title>
                                                </head>
                                                <body>
                                                    <p style="font-size:25px">Your OTP no is: ${otp}. It will expire in 5 minuites. Submit it quickly</p>
                                                </body>
                                                </html>`
                                            }); 
                                        }
                                        );
                                        res.send({msg:'Your OTP has been sent',type:'success'});
                                    }
                                    else{
                                        
                                        res.send({msg:'Your given credentials are wrong',type:'error'});
                                    }
                                }
                                else{
                                    
                                    res.send({msg:'Your given credentials are wrong',type:'error'});
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

router.post('/pin',async(req,res)=>{
    if(req.session.user){
        const {email,password,pin,otp,price,day} = req.body;
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
                        const p = `select email,PASSWORD,BALANCE,pin from NKASH NATURAL JOIN users where user_id=${req.session.user_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                try{
                                    var decoded = jwt.verify(req.session.otp,process.env.JWT_OTP_SECRET);
                                    bcrypt.compare(otp, decoded.otp).then(function(result) {
                                        if(result==true){
                                            bcrypt.compare(pin, r.rows[0][3]).then(function(result) {
                                                if(result==true){
                                                    decoded = jwt.verify(r.rows[0][1],process.env.JWT_PASS_SECRET);
                                                    if(r.rows[0][0]==email && decoded.password==password){
                                                        if(price<=r.rows[0][2]){
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
                                                                            const p = `select subscribe(${day},${req.session.user_id},${price}) from dual`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    res.send('other errors');
                                                                                }
                                                                                else {
                                                                                    res.send({msg:'Subscribed successfully',type:'success',enddate:r.rows[0][0]});
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
                                                            res.send({msg:"Not enough power to proceed",type:'error'})
                                                        }
                                                    }
                                                    else{
                                                        res.send({msg:"Invalid credentials",type:'error'})
                                                    }
                                                }
                                                else{
                                                    res.send({msg:"Invalid credentials",type:'error'})
                                                }
                                            });
                                        }
                                        else{
                                            res.send({msg:"Invalid credentials",type:'error'})
                                        }
                                    });
                                }
                                catch(e){
                                    res.send({msg:"Expired already",type:'error'})
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