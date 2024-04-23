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

router.post('/:id/:type',(req,res)=>{
    if(req.session.user){
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
                        const p = `INSERT INTO watch_list VALUES(idreturn('${creator(req.session.user)}'),'${req.params.id}','${req.body.status}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                //var msg='success';
                                res.redirect(`/contents/${req.params.id}/${req.params.type}/3`);
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
    
});

router.get('/delete/:id/:type',(req,res)=>{
    if(req.session.user){
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
                        const p=`DELETE from WATCH_LIST where user_id=IDRETURN('${creator(req.session.user)}') AND CONTENT_ID=${req.params.id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                //var msg='success';
                                res.redirect(`/contents/${req.params.id}/${req.params.type}/4`);
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
    
});


module.exports = router;