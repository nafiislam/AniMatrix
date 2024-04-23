const form=document.getElementById('postbutton');
form.addEventListener('click',(e)=>{
    const title=document.getElementById('title').value;
    const paragraph=document.getElementById('paragraph').value;
    const content=document.getElementById('content').value;
    const character=document.getElementById('character').value;
    console.log(title,paragraph, content, character);
    fetch(`/post/add`,{
        method: 'POST',
        body: JSON.stringify(
            {title:title,paragraph:paragraph, content:content, character:character}
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
            const parent=document.getElementById('parent');
            parent.innerHTML=`<div class="card border-secondary mb-2">
            <div class="card-header text-success">
              <a href="/profile/${data.user_id}" style="text-decoration: none">
                <h5 class="card-title">${data.user}</h5>
              </a>
            </div>
            <a href="/post/${data.post_id}" style="text-decoration: none">
              <div class="card-body text-secondary">
                <h5 class="card-title">${title}</h5>
              </div>
              <div class="row text-dark ms-2">
              <div class="col-2" style="color:#355764">
                <i class="fa-solid fa-2x fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;<span style="color:white; font-size: 30px;">0</span>
              </div>
            </div>
            </a>
          </div>`+parent.innerHTML;
        }
        else{
            swal({
                title: "Error!",
                text: `${data.msg}`,
                icon: "warning",
                button: "Ok",
            });
        }     
        document.getElementById('title').value='';
        document.getElementById('paragraph').value='';
        document.getElementById('content').value='';
        document.getElementById('character').value='';
    })
    .catch(err=>console.log(err))
})