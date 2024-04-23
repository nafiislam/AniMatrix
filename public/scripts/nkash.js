const image=document.getElementById("image");
image.addEventListener("click",(e)=>{
    //console.log('gr')
    if(image.style.border=="5px solid black"){
        image.style.border="";
    }
    else{
        image.style.border="5px solid black";
    }
    const tidbox= document.getElementById("tidbox")
    if (tidbox.style.display == "none") {
        tidbox.style.display = "block";
    } 
    else{
        tidbox.style.display = "none";
    }
    //document.getElementById("tidbox").style.display = "none";
})

var add = document.getElementById('add')
add.addEventListener("click",function(event){
    const tid = document.getElementById('tid');
    const transactionID=tid.value;
    if(transactionID==''){
        swal({
            title: "Error!",
            text: `Transaction_id input field cannot be empty. Please select payment properly`,
            icon: "warning",
            button: "Ok",
        });
        return;
    }
    console.log(transactionID);
    fetch(`/nkash/add`,{
        method: 'POST',
        body: JSON.stringify(
            {transactionID:transactionID}
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
    })
    .catch(err=>console.log(err))
})

const update=document.getElementById("update");
update.addEventListener("submit",(e)=>{
    e.preventDefault();
    const pin=document.getElementById("pin").value;
    const newpin=document.getElementById("newpin").value;
    const repin=document.getElementById("repin").value;
    if(newpin!=repin){
        document.getElementById("newpin").value='';
        document.getElementById("repin").value='';
        swal({
            title: "Error!",
            text: `Confirm pin does not match`,
            icon: "warning",
            button: "Ok",
        });
    }
    else{
        fetch(`/nkash/update`,{
            method: 'POST',
            body: JSON.stringify(
                {pin:pin,newpin:newpin}
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
                document.getElementById("pin").value='';
                document.getElementById("newpin").value='';
                document.getElementById("repin").value='';
            }
            else{
                swal({
                    title: "Error!",
                    text: `${data.msg}`,
                    icon: "warning",
                    button: "Ok",
                });
                document.getElementById("pin").value='';
                document.getElementById("newpin").value='';
                document.getElementById("repin").value='';
            }
        })
        .catch(err=>console.log(err))
    }
})