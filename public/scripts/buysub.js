const trial=document.getElementById('trial');
trial.addEventListener('click', (e)=>{
    //console.log(email,password)
    fetch(`/subscription/trial`)
    .then(res=>res.json())
    .then(data=>{
        if(data.type=='success'){
            const dg = new Date(data.enddate+'');
            console.log(dg.toString())
            var date=dg.toString().substring(4,15);
            var time=dg.toString().substring(16);
            swal({
                title: "Done!",
                text: `${data.msg}.End of Subscription Date: ${date}, Time: ${time}`,
                icon: "success",
                button: "Ok",
            });
            document.getElementById('trialdiv').remove();
        }
    })
    .catch(err=>console.log(err))
})
// 