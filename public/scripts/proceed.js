const cost=document.getElementById('price').value;
const type=window.location.pathname.split('/')[4];
// console.log('lala')
// console.log(type)
var day=1;
if(type=='trial'){
    day=7;
}
else if(type=='Weekly'){
    day=7;
}
else if(type=='Monthly'){
    day=30;
}
else if(type=='3 month'){
    day=3*30;
}
else if(type=='6 month'){
    day=6*30;
}
else if(type=='Yearly'){
    day=12*30;
}
const quantity=document.getElementById('quantity');
quantity.addEventListener('input',(e)=>{
    const koita=document.getElementById('koita')
    if(quantity.value){
        if(quantity.value<1){
            koita.innerHTML='';
            quantity.value='';
            const niche=document.getElementById('niche');
            niche.innerHTML="Quantity cannot be less than 1"
            price.value=0;
        }
        else if(quantity.value>10){
            quantity.value=10;
            const niche=document.getElementById('niche');
            niche.innerHTML="Quantity cannot be more than 10"
        }
        else{
            const price=document.getElementById('price')
            price.value=cost*quantity.value;
            const niche=document.getElementById('niche');
            niche.innerHTML=""
        }
    }
    else{
        const price=document.getElementById('price')
        price.value=0;
    }
    koita.innerHTML=quantity.value;
})

const proceedtopayment=document.getElementById('proceedtopayment')
proceedtopayment.addEventListener('click',(e)=>{
    const cemail=document.getElementById('cemail')
    const corder=document.getElementById('corder')
    const cprice=document.getElementById('cprice')
    cemail.innerHTML=document.getElementById('email').value
    corder.innerHTML=document.getElementById('order').innerHTML
    cprice.innerHTML=document.getElementById('price').value+' ncoins '
})

const clickme=document.getElementById('clickme');
clickme.addEventListener('click',(e)=>{
    const email=document.getElementById('email').value
    const password=document.getElementById('password').value
    //console.log(email,password)
    fetch(`/subscription/otp`,{
        method: 'POST',
        body: JSON.stringify(
            {email:email,password:password}
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
            const before=document.getElementById('before')
            const after=document.getElementById('after')
            before.style.display="none"
            after.style.display="block"
        }
        else{
            swal({
                title: "Error!",
                text: `${data.msg}`,
                icon: "warning",
                button: "Ok",
            });
            document.getElementById('email').value='';
            document.getElementById('password').value='';
        }
    })
    .catch(err=>console.log(err))
})

const payment=document.getElementById('payment')
payment.addEventListener('click',(e)=>{
    const email=document.getElementById('email').value
    const password=document.getElementById('password').value
    const price=document.getElementById('price').value
    if(price=='' ||price=='0'){
        swal({
            title: "Error!",
            text: `Quantity should be set!!`,
            icon: "warning",
            button: "Ok",
        });
        return;
    }
    const pin=document.getElementById('pin').value
    const otp=document.getElementById('otp').value
    //console.log(email,password)
    fetch(`/subscription/pin`,{
        method: 'POST',
        body: JSON.stringify(
            {email:email,password:password,price:price,pin:pin,otp:otp,day:day}
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
            document.getElementById('email').value='';
            document.getElementById('password').value='';
            document.getElementById('quantity').value='';
            document.getElementById('price').value='';
            document.getElementById('pin').value='';
            document.getElementById('otp').value='';
            const dg = new Date(data.enddate+'');
            console.log(dg.toString())
            var date=dg.toString().substring(4,15);
            var time=dg.toString().substring(16);
            document.getElementById('enddate').innerHTML=`<b>Date:</b> ${date} <b>Time:</b> ${time}`
            const after=document.getElementById('after')
            after.style.display="none"
            const afterafter=document.getElementById('afterafter')
            afterafter.style.display="block"
        }
        else{
            swal({
                title: "Error!",
                text: `${data.msg}`,
                icon: "warning",
                button: "Ok",
            });
            document.getElementById('quantity').value='';
            document.getElementById('price').value='';
            document.getElementById('pin').value='';
            document.getElementById('otp').value='';
        }
    })
    .catch(err=>console.log(err))
})