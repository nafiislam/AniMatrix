var id;
var socket;
var img;
const target=document.getElementById('noti')

fetch(`/notification/get/unseen`)
    .then((response) => response.json())
    .then((data) => {
        //console.log(data)
        //console.log(target.innerHTML)
        target.innerHTML=data.array.length;
    })
    .catch(err=>console.log(err))


fetch(`/chat/getid`)
.then((response) => response.json())
.then((data) => {
    id=data.id;
    img=data.img;
    socket = io('http://localhost:3000');
    socket.on("connect", () => {
        socket.emit('register',{id1:id,id2:undefined})
    });
    socket.on("notify", (d) => {
        target.innerHTML=parseInt(target.innerHTML)+1;
        fetch(`/notification`,{
            method: 'POST',
            body: JSON.stringify(
                {type:'follow',refer_name:d.username,msg:`${d.username} is trying to message you. You can follow this person to start chatting`}
            ),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            swal({
                title: "Alert!",
                text: `${d.username} is trying to message you. You can follow this person to start chatting`,
                icon: "warning",
                button: "Ok",
            });
        })
        .catch(err=>console.log(err))
    });
    socket.on("justnotify", (d) => {
        target.innerHTML=parseInt(target.innerHTML)+1;
        fetch(`/notification`,{
            method: 'POST',
            body: JSON.stringify(
                {type:'follow',refer_name:d.username,msg:`${d.username} is messaging you.`}
            ),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            swal({
                title: "Alert!",
                text: `${d.username} is messaging you.`,
                icon: "warning",
                button: "Ok",
            });
        })
        .catch(err=>console.log(err))
    });
}) 
.catch(err=>console.log(err))