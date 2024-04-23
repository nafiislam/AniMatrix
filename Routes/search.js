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

router.post('/',(req,res)=>{
    //console.log(req.body);
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
                    const p = `select title,type,cover_pic,id from contents where lower(title) LIKE '%'||lower('${lcreator(req.body.search)}') || '%' ESCAPE '/'`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            // console.log(r.rows)
                            res.render('search',{username:req.session.user,array:r.rows,admin:req.session.admin,search:req.body.search});
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