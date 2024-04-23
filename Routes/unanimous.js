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

router.get('/profile',(req,res)=>{
    if(req.session.user){
        res.redirect(`/profile/${req.session.user_id}`);
    }
})

module.exports = router;