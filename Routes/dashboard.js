const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');

const multer=require("multer");
const path=require("path")
const jwt = require('jsonwebtoken');

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


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"./public/upload");
    },
    filename:(req,file,cb)=>{
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                                .replace(fileExt,"")
                                .toLowerCase()
                                .split(" ")
                                .join("-")+ "-" +Date.now();
        cb(null,fileName+fileExt);
    },
});

var upload=multer({ 
    storage:storage,
    limits:{
        fileSize:100000000//100mb
    },
    fileFilter:(req, file, cb)=>{
        if(file.mimetype==="image/jpeg"||file.mimetype==="image/png"||file.mimetype==="image/jpg"){
            cb(null,true);
        }else{
            cb(new Error("ONLY .jpg, .png, .jpeg formtas are allowed"))//cb(null,true); can also be used for silent file handling
        }
    },
});


router.post('/update',upload.single('pic'),(req,res)=>{
    if(req.session.user){
        const location='upload/'+req.file.filename;
        //console.log('ok');
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
                        const p = `update users set PROFILE_PIC='${creator(location)}' where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                res.redirect(`/dashboard?msg=2`);
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
});



router.post('/userupdate',(req,res)=>{
    if(req.session.user){
        const {email,username,country,birthday,gender}=req.body;
        console.log(gender)
        // console.log(req.session.user);
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
                        const p = `select user_id from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e);
                                res.send('other errors');
                            }
                            else {
                                var userId=r.rows[0][0];
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
                                                const p = `update users set email='${creator(email)}',username='${creator(username)}',country='${creator(country)}',birthday=TO_DATE('${creator(birthday)}','YYYY-MM-DD'),gender='${creator(gender)}' where user_id=${userId}`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                        if(req.session.user==username){
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
                                                                            const p = `update users set email='${creator(email)}',country='${creator(country)}',birthday=TO_DATE('${creator(birthday)}','YYYY-MM-DD'),gender='${creator(gender)}' where user_id=${userId}`;
                                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                if(e){
                                                                                    console.log(e);
                                                                                }
                                                                                else {
                                                                                    res.redirect('/dashboard?msg=2');
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
                                                        else
                                                            res.redirect('/dashboard?msg=1');
                                                    }
                                                    else {
                                                        req.session.user=username;
                                                        res.redirect('/dashboard?msg=2');
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

router.post('/passupdate',(req,res)=>{
    if(req.session.user){
        var {password,newpassword,confirmpassword}=req.body;
        
        if(newpassword!=confirmpassword){
            res.redirect('/dashboard?msg=3');
        }
        else{
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
                            const p = `select password from users where username='${creator(req.session.user)}'`;
                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                if(e){
                                    console.log(e);
                                    res.send('other errors');
                                }
                                else {
                                    var decoded = jwt.verify(r.rows[0][0],process.env.JWT_PASS_SECRET);
                                    if(decoded.password!=password){
                                        res.redirect('/dashboard?msg=4');
                                    }
                                    else{
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
                                                        newpassword=jwt.sign({password:newpassword,},process.env.JWT_PASS_SECRET);
                                                        const p = `update users set password='${creator(newpassword)}' where username='${creator(req.session.user)}'`;
                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                            if(e){
                                                                    res.send('other errors');
                                                            }
                                                            else {
                                                                res.redirect('/dashboard?msg=2');
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
    }
    else{
        res.redirect('/users/login/failure');
    }
})

router.get('/',(req,res)=>{
    var msg=req.query.msg;
    if(req.session.user){
        const list=[{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}];
        var title,details;
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
                        getall(:id,:follower,:following,:post,:recom);
                        END;`;
                        con.execute(p, {  // bind variables
                            id:req.session.user_id,
                            follower:{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                            following:{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                            post:{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                            recom:{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                          }, { autoCommit: true }, (e, r) => {
                            if(e){
                                console.log(e)
                                res.send('other errors');
                            }
                            else {
                                const{follower,following,post,recom}=r.outBinds;
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
                                                const p = `select user_id,email,password,username,profile_pic,country,TO_CHAR(joined, 'DD-MON-YYYY' ),TO_CHAR(birthday, 'DD-MON-YYYY' ),gender,type,agereturn(user_id) from users where username='${creator(req.session.user)}'`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
                                                            res.send('other errors');
                                                    }
                                                    else {
                                                        // console.log('before update ');
                                                        // console.log(r.rows[0][4]);
                                                        // res.render('dashboard',{array:r.rows[0],list:list,msg:msg});
                                                        details = r.rows[0];
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
                                                                        const p = `select title from contents`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                    res.send('other errors');
                                                                            }
                                                                            else {
                                                                                title = r.rows;
                                                                                //console.log(title);
                                                                                res.render('dashboard',{array:details,list:list,msg:msg,title:title,follower:follower,following:following,post:post,recom:recom});
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

router.get('/delete',(req,res)=>{
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
                        const p = `delete from users where username='${creator(req.session.user)}'`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                    res.send('other errors');
                            }
                            else {
                                res.redirect('/home/logout');
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