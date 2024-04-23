const express=require('express');
const app=express();

const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors:{origin:"*"}});

const session = require('express-session');
const flash = require('express-flash');
const multer=require("multer");
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
const nodemailer=require('nodemailer');

dotenv.config();

app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    rolling: true
}));

const oracledb = require('oracledb');

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:true}));

app.set("view engine","ejs");

app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname, 'public')));

const usersRouter = require('./Routes/users');
app.use('/users',usersRouter);

const homeRouter = require('./Routes/home');
app.use('/home',homeRouter);

const contentsRouter = require('./Routes/contents');
app.use('/contents',contentsRouter);

const reviewRouter = require('./Routes/review');
app.use('/review',reviewRouter);

const watchListRouter = require('./Routes/watchlist');
app.use('/watchlist',watchListRouter);

const searchRouter = require('./Routes/search');
app.use('/search',searchRouter);

const searchbyRouter = require('./Routes/searchby');
app.use('/searchby',searchbyRouter)

const characterRouter = require('./Routes/character');
app.use('/character',characterRouter);

const toprankedRouter = require('./Routes/topranked');
app.use('/topranked',toprankedRouter);

const topwatchedRouter = require('./Routes/topwatched');
app.use('/topwatched',topwatchedRouter);

const dashBoardRouter = require('./Routes/dashboard');
app.use('/dashboard',dashBoardRouter);

const adminBoardRouter = require('./Routes/admindashboard');
app.use('/admindashboard',adminBoardRouter);

const characterratingRouter = require('./Routes/characterating');
app.use('/characterrating',characterratingRouter);

const recomRouter = require('./Routes/recom');
app.use('/recom',recomRouter);

const adminrecomRouter = require('./Routes/adminrecom');
app.use('/adminrecom',adminrecomRouter);

const contentaddRouter = require('./Routes/contentadd');
app.use('/contentadd',contentaddRouter);

const submissionRouter = require('./Routes/submission');
app.use('/submission',submissionRouter);

const catalogueRouter = require('./Routes/catalogue');
app.use('/catalogue',catalogueRouter);

const profileRouter = require('./Routes/profile');
app.use('/profile',profileRouter);

const allRouter = require('./Routes/all');
app.use('/all',allRouter);

const subscriptionRouter = require('./Routes/subscription');
app.use('/subscription',subscriptionRouter);

const forgotpasswordRouter = require('./Routes/forgotpassword');
app.use('/forgotpassword',forgotpasswordRouter);

const nkashRouter = require('./Routes/nkash');
app.use('/nkash',nkashRouter);

const postRouter = require('./Routes/post');
app.use('/post',postRouter);

const unanimousRouter = require('./Routes/unanimous');
app.use('/unanimous',unanimousRouter);

const chatRouter = require('./Routes/chat');
app.use('/chat',chatRouter)

const notificationRouter = require('./Routes/notification');
app.use('/notification',notificationRouter)

const adminuserreportRouter = require('./Routes/adminuserreport');
app.use('/adminuserreport',adminuserreportRouter)

const admincontentreportRouter = require('./Routes/admincontentreport');
app.use('/admincontentreport',admincontentreportRouter)

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

app.get('/',(req, res) => {
    // res.render('content');
    res.render('portfolio');
    // res.redirect('/home');
});



// have to be at the end of every middleware
app.use((err, req, res, next)=>{
    if(err){
        if(err instanceof multer.MulterError){
            res.status(500).send('There was an upload error');
        }
        else{
            console.log('default error handler');
            res.status(500).send(err.message);
        }
    }
    else{
        res.send('success with everything')
    }
})

function active(io,id){
    var clients = io.sockets;
    //console.log(clients)
    var found=false;
    clients.sockets.forEach(function(data,counter){
        var socketid =  data.id;
        var isConnected = data.connected
        //console.log(id,socketid)
        //console.log(id.localeCompare(socketid)==0)
        // if(id.localeCompare(socketid)==0){
        //     found= true;
        // }
        if(id===socketid){
            found= true;
        }
    });
    if(found)
        return true;
    else
        return false;
}

var sockeMap=new Map();
var map=new Map();
var userMap=new Map();
io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on('register',data=>{
        sockeMap.set(data.id1,socket.id);
        userMap.set(socket.id,data.id1);
        map.set(data.id1,data.id2);
        // return all Socket instanc
    })
    socket.on('send',data=>{
        console.log(io.sockets.server.eio.clients[sockeMap.get(5)])
        console.log('jati')
        try {
            //console.log('here '+sockeMap.get(3))
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
                        const p = `insert into chat values(${data.from},${data.to},sysdate,'${creator(data.msg)}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
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
                                                const p = `select profile_pic,username from users where user_id=${data.from}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        console.log(e)
                                                        //res.send('other errors');
                                                    }
                                                    else {
                                                        var image=r.rows[0][0];
                                                        var username=r.rows[0][1];
                                                        data.to=parseInt(data.to);
                                                        data.from=parseInt(data.from);
                                                        // console.log(map[parseInt(data.to)])
                                                        console.log('jati1')
                                                        if(active(io,sockeMap.get(data.to))&&sockeMap.get(data.to)&&map.get(data.to)==data.from){
                                                            //console.log('i am here')
                                                            if(r.rows[0][0])
                                                                socket.to(sockeMap.get(data.to)).emit('receive',{img:'/'+r.rows[0][0],msg:data.msg})
                                                            else{
                                                                socket.to(sockeMap.get(data.to)).emit('receive',{img:'http://bootdey.com/img/Content/avatar/avatar1.png',msg:data.msg})
                                                            }
                                                        }
                                                        else if(active(io,sockeMap.get(data.to))){
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
                                                                            const p = `select * from follow_list where user_id=${data.to} and following_id=${data.from}`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    res.send('other errors');
                                                                                }
                                                                                else {
                                                                                    if(r.rows.length>0){
                                                                                        socket.to(sockeMap.get(data.to)).emit('justnotify',{username:username})
                                                                                    }
                                                                                    else{
                                                                                        socket.to(sockeMap.get(data.to)).emit('notify',{username:username})
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
                                                            console.log(active(io,sockeMap.get(data.to)))
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
                                                                            const p = `select * from follow_list where user_id=${data.to} and following_id=${data.from}`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    res.send('other errors');
                                                                                }
                                                                                else {
                                                                                    if(r.rows.length>0){
                                                                                        console.log('ji2')
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
                                                                                                        const p = `insert into notification(user_id,refer_id,time,message,status,type) values(${data.to},idreturn('${creator(username)}'),sysdate,'${creator(`${username} is messaging you.`)}','unseen','follow')`;
                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                            if(e){
                                                                                                                console.log(e)
                                                                                                                
                                                                                                            }
                                                                                                            else {
                                                                                                                
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
                                                                                        console.log('ji3')
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
                                                                                                        const p = `insert into notification(user_id,refer_id,time,message,status,type) values(${data.to},idreturn('${creator(username)}'),sysdate,'${creator(`${username} is trying to message you. You can follow this person to start chatting`)}','unseen','follow')`;
                                                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                            if(e){
                                                                                                                console.log(e)
                                                                                                                
                                                                                                            }
                                                                                                            else {
                                                                                                                
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
    socket.on("disconnect",(socket)=>{
        console.log(socket);
    })
})

server.listen(3000,(req, res) => {
    console.log('running port........');
});