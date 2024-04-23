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

router.get('/getid',(req,res)=>{
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
                        const p = `select profile_pic from users where user_id=${req.session.user_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                if(r.rows[0][0]){
                                    res.send({id:req.session.user_id,img:'/'+r.rows[0][0]})
                                }
                                else{
                                    res.send({id:req.session.user_id,img:'http://bootdey.com/img/Content/avatar/avatar1.png'})
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
    //res.render('chat')
})

router.get('/:id',(req,res)=>{
    if(req.session.user){
        var id1=req.session.user_id;
        var id2=req.params.id;
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
                        const p = `select x.sender,y.username,y.profile_pic,x.receiver,z.username,z.profile_pic,x.message,x.time from chat x join users y on x.sender=y.user_id join users z on x.receiver=z.user_id where (x.sender=${id1} AND x.receiver=${id2}) OR (x.sender=${id2} AND x.receiver=${id1}) ORDER BY x.time ASC`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                res.render('chat',{username:req.session.user,admin:req.session.admin,chat:r.rows,id:id1})
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
    //res.render('chat')
})


module.exports = router;