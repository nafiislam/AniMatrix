var array=[]
async function getter(){
    // let sw = await navigator.serviceWorker.ready;
    // //console.log(sw);
    // let push = await sw.pushManager.subscribe({
    // userVisibleOnly: true,
    // applicationServerKey:
    //     "BIT3aYCOJdb5GnWeOXBtAG3WVJPtD_YdXWDFwKu4yrU6O9tFfsH3yKm1c-UeKFncwchlbgPGoAM-88HRyEfaSTs",
    // });
    // fetch(`/users/subscribe`,{
    //     method: 'POST',
    //     body: JSON.stringify(push),
    //     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    // }).then(()=>{return true;})
    // .catch(err=>console.log(err));


    fetch(`/users/userlist`)
  .then((response) => response.json())
  .then((data) => {
        for(let i=0;i<data.array.length;i++){
            array.push(data.array[i][0]);
        }   
    }) 
    .catch(err=>console.log(err))
}
const underuser= document.getElementById("underuser");
const username= document.getElementById("username");
var alreadyuser=false;
username.addEventListener("input",(e)=>{
    // console.log(array)
    // console.log(array.indexOf(`${username.value}`))
    if(array.indexOf(username.value)!=-1){
        underuser.innerHTML="This username is already taken"
        alreadyuser=true;
    }
    else{
        underuser.innerHTML=""
        alreadyuser=false;
    }
})
const underpass= document.getElementById("underpass");
const password= document.getElementById("password");
const underrepass= document.getElementById("underrepass");
const repassword= document.getElementById("repassword");

var shortpass=true;
var equalpass=false;
password.addEventListener("input",(e)=>{
    if(password.value.length<4){
        underpass.innerHTML="Password must be of 4 letters"
        shortpass=true;
    }
    else{
        underpass.innerHTML=""
        shortpass=false;
    }
    if(password.value!=repassword.value){
        underrepass.innerHTML="confirm password is incorrect"
        equalpass=false;
    }
    else{
        underrepass.innerHTML=""
        equalpass=true;
    }
})


repassword.addEventListener("input",(e)=>{
    if(password.value!=repassword.value){
        underrepass.innerHTML="confirm password is incorrect"
        equalpass=false;
    }
    else{
        underrepass.innerHTML=""
        equalpass=true;
    }
})

var form = document.getElementById('register')
form.addEventListener("submit",async function(event){
    event.preventDefault();
    if(alreadyuser){
        swal({
            title: "Error!",
            text: `Given username is already taken`,
            icon: "warning",
            button: "Ok",
        });
        username.value="";
    }
    else{
        if(shortpass){
            swal({
                title: "Error!",
                text: `Given password is <4 letters`,
                icon: "warning",
                button: "Ok",
            });
            password.value="";
            repassword.value="";
        }
        else{
            if(!equalpass){
                swal({
                    title: "Error!",
                    text: `Confirm password does not match with password`,
                    icon: "warning",
                    button: "Ok",
                });
                password.value="";
                repassword.value="";
            }
            else{
                const form = document.getElementById('register');
                const formdata=new FormData(form);
                const username=formdata.get('username');
                const password=formdata.get('password');
                const repassword=formdata.get('repassword');
                const email=formdata.get('email');
                const country=formdata.get('country');
                const birthday=formdata.get('birthday');
                const gender=formdata.get('gender');
                let sw = await navigator.serviceWorker.ready;
                //console.log(sw);
                let push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                    "BIT3aYCOJdb5GnWeOXBtAG3WVJPtD_YdXWDFwKu4yrU6O9tFfsH3yKm1c-UeKFncwchlbgPGoAM-88HRyEfaSTs",
                });
                fetch(`/users/register`,{
                    method: 'POST',
                    body: JSON.stringify(
                        {username:username,email:email,password:password,repassword:repassword,country:country,gender:gender,birthday:birthday,subscription:push}
                    ),
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data.type=='success'){
                        swal({
                            title: "Done!",
                            text: `${data.msg}`,
                            icon: "success",
                            button: "Ok",
                        });
                    }
                    else{
                        swal({
                            title: "Error!",
                            text: `${data.msg}`,
                            icon: "warning",
                            button: "Ok",
                        });
                    }
                    form.reset();
                    fetch(`/users/userlist`)
                    .then((response) => response.json())
                    .then((data) => {
                        array=[];
                        for(let i=0;i<data.array.length;i++){
                            array.push(data.array[i][0]);
                        }   
                    }) 
                    .catch(err=>console.log(err))
                })
                .catch(err=>console.log(err))
            }
        }
    }
    
    // var x = document.getElementById("password");
    // x.style.display = "block";

})