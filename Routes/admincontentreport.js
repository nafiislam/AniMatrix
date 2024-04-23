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

const db=(p)=>{
    return new Promise((resolve, reject)=>{
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
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                reject(e);
                            }
                            else {
                                resolve(r.rows);
                            }
                        });
                    }
                }
            );
        }
        catch (e) {
            reject(e);
        }
    })
}

router.get('/', async(req, res) => {
    if(req.session.user&&req.session.admin){
        var anime,manga,lightnovel,movie;
        anime= await db(`select id,title,noOfPostContent(id),noOfRatingContent(id),noOfwatchContent(id)from contents where type='anime' order by id`);
        manga=await db(`select id,title,noOfPostContent(id),noOfRatingContent(id),noOfwatchContent(id)from contents where type='manga' order by id`);
        lightnovel= await db(`select id,title,noOfPostContent(id),noOfRatingContent(id),noOfwatchContent(id)from contents where type='lightnovel' order by id`);
        movie= await db(`select id,title,noOfPostContent(id),noOfRatingContent(id),noOfwatchContent(id)from contents where type='movie' order by id`);
        //console.log(anime)
        res.render('admincontentreport',{username:req.session.user,admin:req.session.admin,anime:anime,manga:manga,lightnovel:lightnovel,movie:movie})
    }
    else{
        res.redirect('/users/login/failure');
    }
})

module.exports = router;