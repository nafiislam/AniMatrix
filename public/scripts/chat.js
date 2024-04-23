var id;
var socket;
var img;
fetch(`/chat/getid`)
.then((response) => response.json())
.then((data) => {
    id=data.id;
    img=data.img;
    socket = io('http://localhost:3000');
    socket.on("connect", () => {
        socket.emit('register',{id1:id,id2:parseInt(window.location.pathname.split('/')[2])})
    });
    socket.on("receive", (d) => {
        //console.log('i am script')
        document.getElementById('parent').innerHTML+=`<div class="container">
        <img src="${d.img}" alt="Avatar" style="width:100%;">
        <pre style="white-space: pre-wrap;">${d.msg}</pre>
        <span class="time-right">${(new Date()).toString().substring(16)}</span>
      </div>`;
      window.scrollTo(document.documentElement.scrollTop,document.body.scrollHeight);
    });
    socket.on("notify", (d) => {
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


//socket.emit('chi','ami')

function send(id){
    const msg= document.getElementById('target').value;
    document.getElementById('target').value=''
    socket.emit('send',{msg:msg,from:id,to:window.location.pathname.split('/')[2]})
    document.getElementById('parent').innerHTML+=`<div class="container darker">
    <img src="${img}" alt="Avatar" class="right" style="width:100%;">
    <pre style="white-space: pre-wrap;">${msg}</pre>
    <span class="time-left">${new Date().toString().substring(16)}</span>
  </div>`;
    window.scrollTo(document.documentElement.scrollTop,document.body.scrollHeight);
}

setTimeout(scrooltobottom, 100);

function scrooltobottom(){
    window.scrollTo(0,document.body.scrollHeight);
    //setTimeout(printSomething, 1000);
}