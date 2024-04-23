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

router.get('/',(req,res)=>{
    if(req.session.user){
        res.render('search by category',{username:req.session.user,admin:req.session.admin})
    }
    else{
        res.redirect('/users/login/failure');
    }
})

async function get(rows){
    try{
        const anime=await rows.anime.getRows();
        const manga=await rows.manga.getRows();
        const lightnovel=await rows.lightnovel.getRows();
        const movie=await rows.movie.getRows();
        const characters=await rows.characters.getRows();
        const user=await rows.user.getRows();
        const postcontent=await rows.postcontent.getRows();
        const postchar=await rows.postchar.getRows();
        return {anime,manga,lightnovel,movie,characters,user,postcontent,postchar};
    }
    catch(err){
        console.log(err)
    }
}

router.get('/getdata',(req,res)=>{
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
                        search(:anime,:manga,:lightnovel,:movie,:characters,:user,:postcontent,:postchar);
                        END;`;
                        con.execute(p, {  // bind variables
                            anime:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            manga:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            lightnovel:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            movie:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            characters:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            user:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            postcontent:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            postchar:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                get(r.outBinds)
                                .then(data=>{
                                    //console.log(data)
                                    res.send({anime:data.anime,manga:data.manga,lightnovel:data.lightnovel,movie:data.movie,characters:data.characters,user:data.user,postcontent:data.postcontent,postchar:data.postchar})
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

module.exports = router;