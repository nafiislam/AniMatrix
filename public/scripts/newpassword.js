console.log(window.location.pathname.split('/')[3])
var form = document.getElementById('password')
form.addEventListener("submit",function(event){
    event.preventDefault();
    const form = document.getElementById('password');
    const formdata=new FormData(form);
    const password=formdata.get('password');
    const confirmpassword=formdata.get('confirmpassword');
    if(confirmpassword!=password) {
        swal({
            title: "Error!",
            text: `Your confirm password does not match`,
            icon: "warning",
            button: "Ok",
        });
        return false;
    }
    fetch(`/forgotpassword/password/${window.location.pathname.split('/')[3]}`,{
        method: 'POST',
        body: JSON.stringify(
            {password:password}
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
})