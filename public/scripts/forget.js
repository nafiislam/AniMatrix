// window.addEventListener("load", function() {
//     var x = document.getElementById("password");
//     x.style.display = "none";
// });
// window.onload = function() {
//     alert('Page is loaded');
// };
var form = document.getElementById('username')
form.addEventListener("submit",function(event){
    event.preventDefault();
    const form = document.getElementById('username');
    const formdata=new FormData(form);
    const username=formdata.get('username');
    const email=formdata.get('email');
    fetch(`/forgotpassword/email`,{
        method: 'POST',
        body: JSON.stringify(
            {username:username,email:email}
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
    })
    .catch(err=>console.log(err))
    // var x = document.getElementById("password");
    // x.style.display = "block";

})