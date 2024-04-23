const express = require("express");
const router = express.Router();

const oracledb = require('oracledb');
const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');
const webpush= require("web-push");
const fs=require('fs');
const bcrypt=require('bcrypt');

webpush.setVapidDetails(`mailto:${process.env.GMAIL_USER}`,process.env.VAPIDKEYS_PUBLIC,process.env.VAPIDKEYS_PRIVATE);

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

router.get('/logPage',(req,res)=>{
    res.render('login',{msg:''});
});

router.get('/register',(req,res)=>{
    //res.sendFile(__dirname+"/index.html");
    const list=[{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}]
    res.render('register',{msg:'',list:list});
});

router.post('/login',(req,res)=>{
    if(req.params.msg){
        res.render("login",{msg:'Successfully registered now login'});
    }
    const {password,username}=req.body;
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
                    const q = `select * from users where username='${creator(username)}'`;
                    //when insert  { autoCommit: true } between [], and (e,r) for inserting values
                    con.execute(q, [], { autoCommit: true }, (e, r) => {
                        if (e)
                        {
                            res.send('error on');
                        } else if(r.rows.length===0){
                            // res.send('This username does not exist');
                            res.render("login",{msg:'This username does not exist'});
                        }else{
                            //res.send(r);
                            const another = `select password,type from users where username='${creator(username)}'`;
                            con.execute(another, [], { autoCommit: true }, (error, response) => {
                                //console.log(e);
                                if (error)
                                {
                                    res.send('error on');
                                }
                                else{
                                    try {
                                        //console.log(r)
                                        var type=response.rows[0][1];
                                        //console.log(type)
                                        var decoded = jwt.verify(response.rows[0][0],process.env.JWT_PASS_SECRET);
                                        if(password==decoded.password){
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
                                                            const p = `select user_id from users where username='${creator(username)}'`;
                                                            con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                if(e){
                                                                    res.send('other errors');
                                                                }
                                                                else {
                                                                    var id=r.rows[0][0];
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
                                                                                    const p = `select verified from verify where user_id=${id}`;
                                                                                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                        if(e){
                                                                                            res.send('other errors');
                                                                                        }
                                                                                        else {
                                                                                            if(r.rows[0][0]=='true'){

                                                                                                req.session.msg='Successfully Logged';
                                                                                                req.session.user=username;
                                                                                                req.session.user_id=id;
                                                                                                //console.log(response.rows[0][9]);
                                                                                                if(type=='admin'){
                                                                                                    req.session.admin=type;
                                                                                                }
                                                                                                //console.log(type)
                                                                                                req.session.rating=0;
                                                                                                req.session.charrating=0;
                                                                                                //console.log(req.session.user);
                                                                                                res.redirect('/home')
                                                                                            }
                                                                                            else{
                                                                                                res.render("login",{msg:'You are not verified',username:username});
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
                                            res.render("login",{msg:'Password incorrect',username:username});
                                        }
                                    } 
                                    catch(err) {
                                        res.send(err);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        );
    } 
    catch (e) {
        console.log(e);
    }

});

router.get('/login/:msg',(req,res)=>{
    if(req.params.msg){
        if(req.params.msg=='success')
            res.render("login",{msg:'Successfully registered now login'});
        else if(req.params.msg=='failure'){
            res.render("login",{msg:'Login first'});
        }
        else if(req.params.msg=='You are not verified'){
            res.render("login",{msg:'You are not verified'});
        }
    }
});

function func(){
    let today = new Date()
    return today.toISOString().split('T')[0];
}

router.post('/register',async(req,res)=>{
    var {email,password,repassword,username,country,birthday,gender,subscription}=req.body;
    const hashedpin = await bcrypt.hash(username,parseInt(process.env.SALT));
    const list=[{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}];
    //console.log(req.body)
    if(password!=repassword){
        res.send({msg:'Confirm password did not match',type:'error'});
    }
    else if(password.length<4){
        res.send({msg:'Password must be atleast of 4 characters',type:'error'});
    }
    else{
        password=jwt.sign({password:password,},process.env.JWT_PASS_SECRET);
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
                        const time=func();
                        const p = `insert into users values(IDRETURNER,'${creator(email)}','${creator(password)}','${creator(username)}','','${creator(country)}',TO_DATE('${time}','YYYY-MM-DD'),TO_DATE('${birthday}','YYYY-MM-DD'),'${creator(gender)}','user')`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                if (e.errorNum===6510){
                                    res.send({msg:'Same username is already present so no insert',typr:'error'});
                                }
                                else{
                                    res.send('other errors');
                                }
                            }
                            else {
                                //res.render("register",{msg:'successfully registered'});
                                // res.render("login",{msg:'Successfully registered now login'});
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
                                                const p = `insert into verify values(IDRETURNER-1,'false')`;
                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                    if(e){
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
                                                                        const p = `select max(user_id) from users`;
                                                                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                            if(e){
                                                                                res.send('other errors');
                                                                            }
                                                                            else {
                                                                                var id=r.rows[0][0];
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
                                                                                                const p = `INSERT INTO nkash(user_id,username,email,balance,pin) VALUES(idreturn('${creator(username)}'),'${creator(username)}','${creator(email)}',100,'${creator(hashedpin)}')`;
                                                                                                con.execute(p, [], { autoCommit: true }, (e, r) => {
                                                                                                    if(e){
                                                                                                        res.send('other errors');
                                                                                                    }
                                                                                                    else {
                                                                                                        //const subscription = req.body;
                                                                                                        //const subscription = req.app.locals.subscription;
                                                                                                        const payload = JSON.stringify({title: 'nkash account created!',username:username });
                                                                                                        webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                                catch (e) {
                                                                                    console.log(e);
                                                                                }                                                                        
                                                                                var transporter = nodemailer.createTransport({
                                                                                    service: 'gmail',
                                                                                    host: 'smtp.gmail.com',
                                                                                    port: 465,      
                                                                                    secure: true, 
                                                                                    auth: {
                                                                                      user: process.env.GMAIL_USER,
                                                                                      pass: process.env.GMAIL_PASSWORD,
                                                                                    },
                                                                                    tls:{
                                                                                      rejectUnauthorized:false
                                                                                  }
                                                                                });
                                                        
                                                                                jwt.sign({
                                                                                    user:username,id:id,
                                                                                },
                                                                                process.env.JWT_SECRET,
                                                                                {
                                                                                    expiresIn:'1h',
                                                                                },
                                                                                (err,emailToken)=>{
                                                                                    //console.log(emailToken)
                                                                                    const url =`http://localhost:3000/users/verify/${emailToken}`;
                                                                                    transporter.sendMail({
                                                                                        to: email,
                                                                                        subject:'Confirm Email',
                                                                                        html: `<!DOCTYPE html>
                                                                                        <html lang="en">
                                                                                        <head>
                                                                                            <meta charset="UTF-8">
                                                                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                                                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                                            <title>Confirm email</title>
                                                                                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
                                                                                            <style>
                                                                                                .button-24 {
                                                                                                    background: #FF4742;
                                                                                                    border: 1px solid #FF4742;
                                                                                                    border-radius: 6px;
                                                                                                    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
                                                                                                    box-sizing: border-box;
                                                                                                    color: #FFFFFF;
                                                                                                    cursor: pointer;
                                                                                                    display: inline-block;
                                                                                                    font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
                                                                                                    font-size: 16px;
                                                                                                    font-weight: 800;
                                                                                                    line-height: 16px;
                                                                                                    min-height: 40px;
                                                                                                    outline: 0;
                                                                                                    padding: 12px 14px;
                                                                                                    text-align: center;
                                                                                                    text-rendering: geometricprecision;
                                                                                                    text-transform: none;
                                                                                                    user-select: none;
                                                                                                    -webkit-user-select: none;
                                                                                                    touch-action: manipulation;
                                                                                                    vertical-align: middle;
                                                                                                  }
                                                                                                  
                                                                                                  .button-24:hover,
                                                                                                  .button-24:active {
                                                                                                    background-color: initial;
                                                                                                    background-position: 0 0;
                                                                                                    color: #FF4742;
                                                                                                  }
                                                                                                  
                                                                                                  .button-24:active {
                                                                                                    opacity: .5;
                                                                                                  }
                                                                                                </style>    
                                                                                            </head>
                                                                                            <body>
                                                                                            <div class="row">
                                                                                            <img src="http://drive.google.com/uc?export=view&id=11d1JZCNOu-B69BjTYC1MjwEIhDJr5bUm" class="img-thumbnail mx-auto my-auto" style="width:800px;height:600px;align-items:center">
                                                                                            </div>
                                                                                            <div class="row">
                                                                                                <a href="${url}"><button class="button-24" role="button" style=" margin-left:400px; padding:10px;">Click to verify email</button></a>
                                                                                                <p style="margin: auto;padding: 10px; font-size: 20px;">Please click this to verify your email: <a href="${url}">${url}</a></p>
                                                                                            </div>
                                                                                            <script
                                                                                            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                                                                            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                                                                            crossorigin="anonymous"
                                                                                            ></script>
                                                                                        </body>
                                                                                        </html>`,
                                                                                    }); 
                                                                                },
                                                                                );
                                                                                var msg='success';
                                                                                // res.redirect(`/users/login/${msg}`);
                                                                                res.send({msg:'Successfully registered',type:'success'});
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
                                //res.send('successfully registered');
                                //res.sendFile(__dirname+"/home.html");
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

router.post('/subscribe',(req, res)=>{
    const subscription = req.body;
    //console.log(subscription);
    req.app.locals.subscription=subscription;
})

router.get('/verify/:token',(req,res)=> {
    try{
        const{id}=jwt.verify(req.params.token,process.env.JWT_SECRET);
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
                        const p = `update verify set verified='true' where user_id=${id}`;
                        con.execute(p, [], { autoCommit: true }, (e, r) => {
                            if(e){
                                res.send('other errors');
                            }
                            else {
                                //res.send('confirmed');
                                //console.log('/public/html/confirmed.html',{ root: '.' });
                                res.sendFile('/public/html/confirmed.html',{ root: '.' });
                            }
                        });
                    }
                }
            );
        }
        catch (e) {
            console.log(e);
        } 
    }catch (e) {
        res.sendFile('/public/html/notconfirmed.html',{ root: '.' });
    }
})

router.get('/userlist',(req,res)=> {
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
                    const p = `select username from users`;
                    con.execute(p, [], { autoCommit: true }, (e, r) => {
                        if(e){
                            res.send('other errors');
                        }
                        else {
                            res.send({array:r.rows})
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