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

function lcreator(st){
    if(st){
        s ='';
        for (let i=0;i<st.length;i++){
            if(st[i]=='\'')
                s+="''";
            else if(st[i]=='/')
                s+='//';
            else if(st[i]=='%')
                s+='/%';
            else if(st[i]=='_')
                s+='/_';
            else{
                s+=st[i];
            }
        }
        return s;
    }
    return st;
}

async function get(rows){
    try{
        const anime=await rows.anime.getRows();
        const manga=await rows.manga.getRows();
        const lightnovel=await rows.lightnovel.getRows();
        const movie=await rows.movie.getRows();
        const full=await rows.full.getRows();
        const follower=await rows.follower.getRows();
        const user=await rows.user.getRows();
        const name=rows.name;
        return {anime,manga,lightnovel,movie,full,follower,user,name};
    }
    catch(err){
        console.log(err)
    }
}

router.get('/followlist',(req,res)=>{
    console.log('asi')
    if(req.session.user){
        try {
            console.log('run')
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
                        console.log('run')
                        const p = `select * from follow_list join users on follow_list.following_id=users.user_id where follow_list.user_id=idreturn('${creator(req.session.user)}')`;
                        console.log(p);
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e);
                                res.send('other errors');
                            }
                            else {
                                res.render('followlist',{username: req.session.user,admin:req.session.admin,followlist:r.rows})
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

router.get('/:id',(req,res)=>{
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
                        
                        const p = `BEGIN
                        follow(:my_id,:other_id,:anime,:manga,:lightnovel,:movie,:full,:follower,:user,:name);
                        END;`;
                        con.execute(p, {  // bind variables
                            my_id:req.session.user,
                            other_id:parseInt(req.params.id),
                            anime:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            manga:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            lightnovel:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            movie:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            full:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            follower:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            user:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            name:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 }
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                get(r.outBinds)
                                .then(data=>{
                                    // console.log(data.anime)
                                    // console.log(data.manga)
                                    // console.log(data.lightnovel)
                                    // console.log(data.movie)
                                    // console.log(data.full)
                                    // console.log(data.follower)
                                    // console.log(data.user)
                                    // console.log(data.name)
                                    var type;
                                    if(data.follower.length>0){
                                        type='followed'
                                    }
                                    else if(data.name==req.session.user){
                                        type='me'
                                    }
                                    else{
                                        type='follow'
                                    }
                                    // console.log(type)
                                    // console.log(data.name)
                                    var total=data.anime.length+data.manga.length+data.lightnovel.length+data.movie.length
                                    res.render('profile',{anime:data.anime,manga:data.manga,lightnovel:data.lightnovel,movie:data.movie,full:data.full,follower:data.follower,user:data.user,type:type,total:total,username:req.session.user,admin:req.session.admin})
                                }).catch(err=>{
                                    console.log(err)
                                })
                                
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

router.get('/follow/:id',(req,res)=>{
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
                        const p = `insert into follow_list values(idreturn('${creator(req.session.user)}'),${req.params.id},sysdate)`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Successfully following'});
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
        res.send({msg:'You are not logged in'});
    }
})

router.get('/unfollow/:id',(req,res)=>{
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
                        const p = `delete from follow_list where user_id=idreturn('${creator(req.session.user)}') and following_id=${req.params.id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Successfully following'});
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
        res.send({msg:'You are not logged in'});
    }
})



module.exports = router;