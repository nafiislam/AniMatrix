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

router.get('/',(req,res)=>{
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
                    const p = `select CHARACTER_ID,name,TYPE,url,content_id,description,(select AVG(rating) from CHARACTER_RATING where CHARACTER_LIST.CHARACTER_ID=CHARACTER_RATING.CHARACTER_ID) AS "rate",(select type from contents where contents.id=CONTENT_ID),(select title from contents where contents.id=CONTENT_ID) from CHARACTER_LIST order by (select AVG(rating) from CHARACTER_RATING where CHARACTER_LIST.CHARACTER_ID=CHARACTER_RATING.CHARACTER_ID) DESC NULLS LAST`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                                res.send('other errors');
                        }
                        else {
                            // console.log(r.rows[0]);
                            res.render('characterrating',{array:r.rows,username:req.session.user,admin:req.session.admin});
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