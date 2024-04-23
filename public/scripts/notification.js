var stat='unseen';
document.getElementById('unseen').addEventListener('click', (e)=>{
    stat='unseen';
    fetch(`/notification/get/unseen`)
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('target').innerHTML=''
        for(let i=0;i<data.array.length;i++){
            document.getElementById('target').innerHTML+=`<tr>
            <th scope="row">${i+1}</th>
            <td><a style="text-decoration:none;" onclick="return seen(${data.array[i][0]})" href="/profile/${data.array[i][2]}">${data.array[i][4]}</a></td>
            </tr>`;
        }
    })
    .catch(err=>console.log(err))
})
document.getElementById('seen').addEventListener('click', (e)=>{
    stat='seen';
    fetch(`/notification/get/seen`)
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('target').innerHTML=''
        for(let i=0;i<data.array.length;i++){
            document.getElementById('target').innerHTML+=`<tr>
            <th scope="row">${i+1}</th>
            <td><a style="text-decoration:none;" onclick="return seen(${data.array[i][0]})" href="/profile/${data.array[i][2]}">${data.array[i][4]}</a></td>
            </tr>`;
        }
    })
    .catch(err=>console.log(err))
})
document.getElementById('all').addEventListener('click', (e)=>{
    stat='all';
    fetch(`/notification/get/all`)
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('target').innerHTML=''
        for(let i=0;i<data.array.length;i++){
            document.getElementById('target').innerHTML+=`<tr>
            <th scope="row">${i+1}</th>
            <td><a style="text-decoration:none;" onclick="return seen(${data.array[i][0]})" href="/profile/${data.array[i][2]}">${data.array[i][4]}</a></td>
            </tr>`;
        }
    })
    .catch(err=>console.log(err))
})


fetch(`/notification/get/unseen`)
.then((response) => response.json())
.then((data) => {
    for(let i=0;i<data.array.length;i++){
        document.getElementById('target').innerHTML+=`<tr>
        <th scope="row">${i+1}</th>
        <td><a style="text-decoration:none;" onclick="return seen(${data.array[i][0]})" href="/profile/${data.array[i][2]}">${data.array[i][4]}</a></td>
        </tr>`;
    }
})
.catch(err=>console.log(err))

function seen(id){ 
    fetch(`/notification/seen/${id}`)
    .catch(err=>console.log(err))
    return true;
}

function seenAll(){
    //console.log('chole')
    fetch(`/notification/seenall`)
    .catch(err=>console.log(err))
    if(stat=='unseen'){
        document.getElementById('target').innerHTML='';
    }
}