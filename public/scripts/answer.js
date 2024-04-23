const up=document.getElementById('up')
const down=document.getElementById('down')

const upvote=parseInt(document.getElementById('upvote').innerHTML);


function bacha(){
    document.getElementById('show').style.display="block";
    document.getElementById('show2').style.display="none";
}
up.addEventListener('click',(e)=>{
    window.setTimeout(bacha, 200);
    document.getElementById('show').style.display="none";
    document.getElementById('show2').style.display="block";
    var input;
    //console.log(up.style.color)
    if(up.style.color==="black"){
        input='up';
    }
    else if(up.style.color==="green"){
        input='down';
    }
    else if(up.style.color==="rgb(128, 128, 128)"){
        input='upup';
    }
    var post_id=document.getElementById('upvote').getAttribute('data-id');
    //console.log(post_id)
    //console.log(input)
    fetch(`/post/upvote/${post_id}`,{
        method: 'POST',
        body: JSON.stringify(
            {state:input}
        ),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
    .then(res=>res.json())
    .then(data=>{
        document.getElementById('upvote').innerHTML=data.upvote;
    })
    .catch(err=>console.log(err))
    if(up.style.color==="green"){
        up.style.color="black"
        down.style.color="black";
        //document.getElementById('upvote').innerHTML=upvote;
    }
    else{
        down.style.color="#808080";
        up.style.color="green"
        //document.getElementById('upvote').innerHTML=upvote+1;
    }
})
down.addEventListener('click',(e)=>{
    window.setTimeout(bacha, 200);
    document.getElementById('show').style.display="none";
    document.getElementById('show2').style.display="block";
    var input;
    if(down.style.color==="black"){
        input='down';
    }
    else if(down.style.color==="red"){
        input='up';
    }
    else if(down.style.color==="rgb(128, 128, 128)"){
        input='downdown';
    }
    var post_id=document.getElementById('upvote').getAttribute('data-id');
    //console.log(post_id)
    //console.log(input)
    fetch(`/post/upvote/${post_id}`,{
        method: 'POST',
        body: JSON.stringify(
            {state:input}
        ),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
    .then(res=>res.json())
    .then(data=>{
        document.getElementById('upvote').innerHTML=data.upvote;
    })


    if(down.style.color==="red"){
        down.style.color="black"
        up.style.color="black";
        //document.getElementById('upvote').innerHTML=upvote;
    }
    else{
        up.style.color="#808080";
        down.style.color="red"
        //document.getElementById('upvote').innerHTML=upvote-1;
    }
})

function submitAnswer(post_id){
    const paragraph=document.getElementById('paragraph').value
    fetch(`/post/answer/${post_id}`,{
        method: 'POST',
        body: JSON.stringify(
            {paragraph: paragraph}
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
            const answerlist=document.getElementById('answerlist');
            answerlist.innerHTML=`<div class="container">
            <div class="row">
              <div class="col-1"></div>
              <div class="card border-secondary mb-2">
                <div class="card-header text-success">
                  <a href="/profile/${data.user_id}" style="text-decoration: none">
                    <h5 class="card-title">${data.username}</h5>
                  </a>
                </div>
                <div class="card-body text-secondary">
                <pre class="card-text" style="white-space: pre-wrap;font-size: 20px;
                font-family: 'Helvetica Neue',Helvetica;">${paragraph}</pre>
                </div>
              </div>
            </div>
          </div>`+answerlist.innerHTML;
        }
        else{
            swal({
                title: "Error!",
                text: `${data.msg}`,
                icon: "warning",
                button: "Ok",
            });
        }
        document.getElementById('paragraph').value='';
        
    })
}

function report(post_id){
    const Nudity=document.getElementById('Nudity')
    const Spam=document.getElementById('Spam')
    const Violance=document.getElementById('Violance')
    const Harrasement=document.getElementById('Harrasement')
    const False=document.getElementById('False information')
    const Hate=document.getElementById('Hate Speech')
    const Suicide=document.getElementById('Suicide or self injury')
    const Unauthorised=document.getElementById('Unauthorised Info')
    const others=document.getElementById('others')
    const description=document.getElementById('para')
    if(description.value==''){
        swal({
            title: "Error!",
            text: `Description cannot be empty`,
            icon: "warning",
            button: "Ok",
        });
        Nudity.checked=false;
        Spam.checked=false;
        Violance.checked=false;
        Harrasement.checked=false;
        False.checked=false;
        Hate.checked=false;
        Suicide.checked=false;
        Unauthorised.checked=false;
        others.checked=false;
        return;
    }
    if(Nudity.checked||Spam.checked||Violance.checked||Harrasement.checked||False.checked||Hate.checked||Suicide.checked||Unauthorised.checked||others.checked){
        var report='';
        if(Nudity.checked)
            report+=Nudity.value+";"
        if(Spam.checked)
            report+=Spam.value+";"
        if(Violance.checked)
            report+=Violance.value+";"
        if(Harrasement.checked)
            report+=Harrasement.value+";"           
        if(False.checked)
            report+=False.value+";"
        if(Hate.checked)
            report+=Hate.value+";"
        if(Suicide.checked)
            report+=Suicide.value+";"
        if(Unauthorised.checked)
            report+=Unauthorised.value+";"
        if(others.checked)
            report+=others.value+";"
        console.log(report)
        fetch(`/post/report/${post_id}`,{
            method: 'POST',
            body: JSON.stringify(
                {report:report, description:description.value}
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

            Nudity.checked=false;
            Spam.checked=false;
            Violance.checked=false;
            Harrasement.checked=false;
            False.checked=false;
            Hate.checked=false;
            Suicide.checked=false;
            Unauthorised.checked=false;
            others.checked=false;
            description.value=''
        })
        .catch(err=>console.log(err))
    }
    else{
        swal({
            title: "Error!",
            text: `Atleast one check is needed`,
            icon: "warning",
            button: "Ok",
        });
        description.value=''
        return;
    }
}