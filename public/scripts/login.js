function getCookie(cname){
    var name = cname+"=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i=0;i<ca.length;i++){
        var c=ca[i];
        while(c.charAt(0)==' '){
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length,c.length);
        }
    }
}


function checker(){
    if(getCookie('username'))
        document.getElementById("username").value=getCookie('username');
    if(getCookie('password'))
        document.getElementById("password").value=getCookie('password');
    if(getCookie('username')){
        document.getElementById("check").checked=true;
    }
}

const form =document.getElementById("login");
form.addEventListener("submit",(event)=>{
    const checked= document.getElementById("check").checked;
    if(checked){
        const username=document.getElementById("username").value;
        const password=document.getElementById("password").value;
        document.cookie="username="+username+";path=http://localhost:3000/users/logPage?"+";max-age=2628000;";
        document.cookie="password="+password+";path=http://localhost:3000/users/logPage?"+";max-age=2628000;";
        //  default is session
        // One week: max-age=604800
        // One month: max-age=2628000
        // One year: max-age=31536000
    }
    else{
        document.cookie="username=";
        document.cookie="password=";
    }
})