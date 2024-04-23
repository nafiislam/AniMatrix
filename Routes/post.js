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
function func(s){
    st='';
    st+="TO_CLOB('"+s.substring(0,3500)+"')";
    for(let i=1;i<Math.ceil(s.length/3500.0);i++){
        st+="||TO_CLOB('"+s.substring(i*3999, (i+1)*3500)+"')";
    }
    return st;
}

async function get(rows){
    try{
        const posts=await rows.posts.getRows();
        const contents=await rows.contents.getRows();
        const characters=await rows.characters.getRows();
        return {posts,contents,characters};
    }
    catch(err){
        console.log(err)
    }
}

router.get('/',(req,res)=>{
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
                        postget(:posts,:contents,:characters);
                        END;`;
                        con.execute(p, {  // bind variables
                            posts:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            contents:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            characters:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                get(r.outBinds)
                                .then(data=>{
                                    res.render('posts',{posts:data.posts,contents:data.contents,characters:data.characters,username:req.session.user,admin:req.session.admin})
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

router.post('/add',(req,res)=>{
    if(req.session.user){
        const {title,paragraph,content,character}=req.body;
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
                        const p = `insert into post(title,paragraph,upvote,user_id) values('${creator(title)}',${func(creator(paragraph))},0,${req.session.user_id})`;
                        //console.log(p)
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e);
                                res.send('other errors1');
                            }
                            else {
                                var post_id;
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
                                                const p = `select max(post_id) from post`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                       post_id=r.rows[0][0];
                                                       if(content){
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
                                                                            const p = `insert into what_content values((select max(post_id) from post),${content})`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    res.send('other errors');
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
                                                        
                                                        if(character){
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
                                                                            const p = `insert into which_character values((select max(post_id) from post),${character})`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    res.send('other errors');
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
                                                        res.send({msg:'Post has been added',type:'success',user_id:req.session.user_id,post_id:post_id,user:req.session.user});
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

async function postget(rows){
    try{
        const post=await rows.post.getRows();
        console.log('aschi');
        const answers=await rows.answers.getRows();
        const content=await rows.content.getRows();
        const character=await rows.character.getRows();
        const state=rows.state;
        return {post,answers,content,character,state};
    }
    catch(err){
        console.log(err)
    }
}

router.post('/upvote/:post_id',(req,res)=>{
    if(req.session.user){
        const {state}=req.body;
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
                        upvoter(:u_id,:p_id,:type);
                        END;`;
                        con.execute(p, {  // bind variables
                            u_id:req.session.user_id,
                            p_id:req.params.post_id,
                            type:state
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
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
                                                const p = `select upvote from post where post_id=${req.params.post_id}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        res.send('other errors');
                                                    }
                                                    else {
                                                        res.send({upvote:r.rows[0][0]})
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


router.post('/answer/:post_id',(req,res)=>{
    if(req.session.user){
        const {paragraph}=req.body;
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
                        const p = `insert into answer(paragraph,post_id,user_id) values(${func(creator(paragraph))},${req.params.post_id},${req.session.user_id})`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Answer added successfully',type:'success',user_id:req.session.user_id,username:req.session.user});
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

router.post('/report/:post_id',(req,res)=>{
    if(req.session.user){
        const {report,description}=req.body;
        //console.log(report,description);
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
                        const p = `insert into report(post_id,user_id,report,description) values(${req.params.post_id},${req.session.user_id},'${creator(report)}','${creator(description)}')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Report has been sent to admin',type:'success'})
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

router.get('/reportdelete/:id',(req,res)=>{
    if(req.session.user&&req.session.admin){
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
                        const p = `delete from report where id=${req.params.id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Report has been rejected successfully',type:'success'})
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

router.get('/delete/:post_id',(req,res)=>{
    if(req.session.user&&req.session.admin){
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
                        const p = `delete from post where post_id=${req.params.post_id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                res.send({msg:'Post has been deleted successfully',type:'success'})
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

router.get('/:post_id',(req,res)=>{
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
                        answers(:my_id,:p_id,:post,:answers,:content,:character,:state);
                        END;`;
                        con.execute(p, {  // bind variables
                            my_id:req.session.user_id,
                            p_id:req.params.post_id,
                            post:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            answers:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            content:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            character:{ dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                            state:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 }
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                postget(r.outBinds)
                                .then(data=>{
                                    //console.log('amiasi')
                                    //console.log(data)
                                    //console.log(typeof data.state)
                                    //console.log(data.post,data.answers,data.content,data.character,data.state)
                                    res.render('Answer_post',{post:data.post,answers:data.answers,content:data.content,character:data.character,state:data.state,username:req.session.user,admin:req.session.admin})
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