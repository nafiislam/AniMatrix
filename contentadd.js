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

router.post('/anime',(req,res)=>{
    if(req.session.user){
        const {title,type,source_id_1,locked,cover_pic,synopsis,episode_no,status,air_start_date,air_end_date,season,producers,licensors,studios,source,genres,duration} =req.body
        var source_id;
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                source_id = r.rows[0][0];
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
                                                const p = `insert into contents(title,type,source_id,locked,cover_pic,synopsis) values('${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added');
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
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
                                                const p = `insert into anime values((select max(id) from contents),'${episode_no}','${creator(status)}',TO_DATE('${air_start_date}','YYYY-MM-DD'),TO_DATE('${air_end_date}','YYYY-MM-DD'),'${creator(season)}','${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(genres)}','${creator(duration)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added')
                                                        res.redirect('/admindashboard?msg=4')
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

router.post('/manga',(req,res)=>{
    if(req.session.user){
        const {title,type,source_id_1,locked,cover_pic,synopsis,volumes,chapters,status,genres,authors_artists} =req.body
        var source_id;
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                source_id = r.rows[0][0];
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
                                                const p = `insert into contents(title,type,source_id,locked,cover_pic,synopsis) values('${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added')
                                                        
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
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
                                                const p = `insert into manga values((select max(id) from contents),'${volumes}','${chapters}','${creator(status)}','${creator(genres)}','${creator(authors_artists)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added')
                                                        res.redirect('/admindashboard?msg=4')
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

router.post('/lightnovel',(req,res)=>{
    if(req.session.user){
        const {title,type,source_id_1,locked,cover_pic,synopsis,volumes,publish_date,status,genres,authors} =req.body
        var source_id;
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                source_id = r.rows[0][0];
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
                                                const p = `insert into contents(title,type,source_id,locked,cover_pic,synopsis) values('${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added');
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
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
                                                const p = `insert into lightnovel values((select max(id) from contents),'${volumes}','${publish_date}','${creator(status)}','${creator(genres)}','${creator(authors)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added')
                                                        res.redirect('/admindashboard?msg=4')
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

router.post('/movie',(req,res)=>{
    if(req.session.user){
        const {title,type,source_id_1,locked,cover_pic,synopsis,release_date,producers,licensors,studios,source,duration} =req.body
        var source_id;
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
                        const p = `select id from contents where title ='${creator(source_id_1)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                source_id = r.rows[0][0];
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
                                                const p = `insert into contents(title,type,source_id,locked,cover_pic,synopsis) values('${creator(title)}','${creator(type)}','${source_id}','${creator(locked)}','${creator(cover_pic)}','${creator(synopsis)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added');
                                                    }
                                                });
                                            }
                                        }
                                    );
                                } 
                                catch (e) {
                                    console.log(e);
                                }
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
                                                const p = `insert into movie values((select max(id) from contents),'${release_date}','${creator(producers)}','${creator(licensors)}','${creator(studios)}','${creator(source)}','${creator(duration)}')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        console.log('content added')
                                                        res.redirect('/admindashboard?msg=4')
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


module.exports = router;