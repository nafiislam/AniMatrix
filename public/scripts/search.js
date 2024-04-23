var show='show2'
function stop(){
  document.getElementById('show').style.display='none';
  document.getElementById(show).style.display='block';
}
var lifesaver;
var anime=[],manga=[],lightnovel=[],movie=[],characters=[],user=[],postcontent=[],postchar=[];
fetch(`/searchby/getdata`)
  .then((response) => response.json())
  .then((data) => {
        console.log(data)
        anime=data.anime;
        manga=data.manga;
        lightnovel=data.lightnovel;
        movie=data.movie;
        characters=data.characters;
        user=data.user;
        postcontent=data.postcontent;
        postchar=data.postchar;
    })
    .catch(err=>console.log(err))
document.getElementById('target').addEventListener('input',(e)=>{
    document.getElementById('show').style.display='block';
    document.getElementById('show2').style.display='none';
    clearTimeout(lifesaver);
    lifesaver=window.setTimeout(stop, 250);
    if(document.getElementById('t').innerHTML=='Anime'){
        show='show2'
        var target=document.getElementById('divtarget');
        target.innerHTML='';
        var input=document.getElementById('target').value;
        if(input==''){
            return;
        }
        var  s='';
        for(let i=0;i<anime.length;i++){
            if(anime[i][2].toLowerCase().includes(input.toLowerCase())){
                s+=`      <div class="card text-white bg-dark me-3 mb-3">
                <img
                  src="${anime[i][3]}"
                  class="card-img rounded-circle"
                  alt="..."
                  style="height: 200px; width: 200px"
                />
                <div class="card-body" style="height: 180px">
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">${anime[i][2]}</p>
                  </div>
                </div>
                <div class="card-footer" style="padding: 0">
                  <div class="d-grid gap-0">
                    <a style="background-color:#D61C4E;"
                      class="btn btn-outline-light"
                      href="/contents/${anime[i][0]}/${anime[i][1]}"
                      role="button"
                      >Go to content</a
                    >
                  </div>
                </div>
              </div>`
            }
        }
        target.innerHTML=s;
    }
    else if(document.getElementById('t').innerHTML=='Manga'){
        show='show2'
        var target=document.getElementById('divtarget');
        target.innerHTML='';
        var input=document.getElementById('target').value;
        if(input==''){
            return;
        }
        var  s='';
        for(let i=0;i<manga.length;i++){
            if(manga[i][2].toLowerCase().includes(input.toLowerCase())){
                s+=`      <div class="card text-white bg-dark me-3 mb-3">
                <img
                  src="${manga[i][3]}"
                  class="card-img rounded-circle"
                  alt="..."
                  style="height: 200px; width: 200px"
                />
                <div class="card-body" style="height: 180px">
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">${manga[i][2]}</p>
                  </div>
                </div>
                <div class="card-footer" style="padding: 0">
                  <div class="d-grid gap-0">
                    <a style="background-color:#D61C4E;"
                      class="btn btn-outline-light"
                      href="/contents/${manga[i][0]}/${manga[i][1]}"
                      role="button"
                      >Go to content</a
                    >
                  </div>
                </div>
              </div>`
            }
        }
        target.innerHTML=s;
    }
    else if(document.getElementById('t').innerHTML=='Lightnovel'){
        show='show2'
        var target=document.getElementById('divtarget');
        target.innerHTML='';
        var input=document.getElementById('target').value;
        if(input==''){
            return;
        }
        var  s='';
        for(let i=0;i<lightnovel.length;i++){
            if(lightnovel[i][2].toLowerCase().includes(input.toLowerCase())){
                s+=`      <div class="card text-white bg-dark me-3 mb-3">
                <img
                  src="${lightnovel[i][3]}"
                  class="card-img rounded-circle"
                  alt="..."
                  style="height: 200px; width: 200px"
                />
                <div class="card-body" style="height: 180px">
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">${lightnovel[i][2]}</p>
                  </div>
                </div>
                <div class="card-footer" style="padding: 0">
                  <div class="d-grid gap-0">
                    <a style="background-color:#D61C4E;"
                      class="btn btn-outline-light"
                      href="/contents/${lightnovel[i][0]}/${lightnovel[i][1]}"
                      role="button"
                      >Go to content</a
                    >
                  </div>
                </div>
              </div>`
            }
        }
        target.innerHTML=s;
    }
    else if(document.getElementById('t').innerHTML=='Movie'){
        show='show2'
        var target=document.getElementById('divtarget');
        target.innerHTML='';
        var input=document.getElementById('target').value;
        if(input==''){
            return;
        }
        var  s='';
        for(let i=0;i<movie.length;i++){
            if(movie[i][2].toLowerCase().includes(input.toLowerCase())){
                s+=`      <div class="card text-white bg-dark me-3 mb-3">
                <img
                  src="${movie[i][3]}"
                  class="card-img rounded-circle"
                  alt="..."
                  style="height: 200px; width: 200px"
                />
                <div class="card-body" style="height: 180px">
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">${movie[i][2]}</p>
                  </div>
                </div>
                <div class="card-footer" style="padding: 0">
                  <div class="d-grid gap-0">
                    <a style="background-color:#D61C4E;"
                      class="btn btn-outline-light"
                      href="/contents/${movie[i][0]}/${movie[i][1]}"
                      role="button"
                      >Go to content</a
                    >
                  </div>
                </div>
              </div>`
            }
        }
        target.innerHTML=s;
    }
    else if(document.getElementById('t').innerHTML=='Character'){
        show='show2'
        var target=document.getElementById('divtarget');
        target.innerHTML='';
        var input=document.getElementById('target').value;
        if(input==''){
            return;
        }
        var  s='';
        for(let i=0;i<characters.length;i++){
            if(characters[i][3].toLowerCase().includes(input.toLowerCase())){
                s+=`      <div class="card text-white bg-dark me-3 mb-3">
                <img
                  src="${characters[i][4]}"
                  class="card-img rounded-circle"
                  alt="..."
                  style="height: 200px; width: 200px"
                />
                <div class="card-body" style="height: 200px">
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">${characters[i][3]}</p>
                  </div>
                  <div
                    class="text-wrap"
                    style="width: 7rem; font-style: italic"
                  >
                    <p class="text-light">Ref: ${characters[i][5]}</p>
                  </div>
                </div>
                <div class="card-footer" style="padding: 0">
                  <div class="d-grid gap-0">
                    <a style="background-color:#D61C4E;"
                      class="btn btn-outline-light"
                      href="/character/${characters[i][0]}/${characters[i][1]}/${characters[i][2]}"
                      role="button"
                      >Character profile</a
                    >
                  </div>
                </div>
              </div>`
            }
        }
        target.innerHTML=s;
    }
    else if(document.getElementById('t').innerHTML=='Users'){
      show='show2'
      var target=document.getElementById('divtarget');
      target.innerHTML='';
      var input=document.getElementById('target').value;
      if(input==''){
          return;
      }
      var  s='';
      for(let i=0;i<user.length;i++){
          if(user[i][1].toLowerCase().includes(input.toLowerCase())){
            if(user[i][2]){
              s+=`      <div class="card text-white bg-dark me-3 mb-3">
              <img
                src="${user[i][2]}"
                class="card-img rounded-circle"
                alt="..."
                style="height: 200px; width: 200px"
              />
              <div class="card-body" style="height: 100px">
                <div
                  class="text-wrap"
                  style="width: 7rem; font-style: italic"
                >
                  <p class="text-light">${user[i][1]}</p>
                </div>
              </div>
              <div class="card-footer" style="padding: 0">
                <div class="d-grid gap-0">
                  <a style="background-color:#D61C4E;"
                    class="btn btn-outline-light"
                    href="/profile/${user[i][0]}"
                    role="button"
                    >User profile</a
                  >
                </div>
              </div>
            </div>`
            }
            else{
              s+=`      <div class="card text-white bg-dark me-3 mb-3">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                class="card-img rounded-circle"
                alt="..."
                style="height: 200px; width: 200px"
              />
              <div class="card-body" style="height: 100px">
                <div
                  class="text-wrap"
                  style="width: 7rem; font-style: italic"
                >
                  <p class="text-light">${user[i][1]}</p>
                </div>
              </div>
              <div class="card-footer" style="padding: 0">
                <div class="d-grid gap-0">
                  <a style="background-color:#D61C4E;"
                    class="btn btn-outline-light"
                    href="/profile/${user[i][0]}"
                    role="button"
                    >User profile</a
                  >
                </div>
              </div>
            </div>`
            }
          }
      }
      target.innerHTML=s;
  }
  else if(document.getElementById('t').innerHTML=='Post by content'){
    show='show3'
    var target=document.getElementById('divtarget2');
    target.innerHTML='';
    var input=document.getElementById('target').value;
    if(input==''){
        return;
    }
    var  s='';
    for(let i=0;i<postcontent.length;i++){
        if(postcontent[i][5].toLowerCase().includes(input.toLowerCase())){
            s+=`<div class="card border-secondary mb-2" >
            <div class="card-header text-success">
              <a href="/profile/${postcontent[i][0]}" style="text-decoration: none">
                <h5 class="card-title">${postcontent[i][1]}</h5>
              </a>
            </div>
            <a href="/post/${postcontent[i][2]}" style="text-decoration: none">
              <div class="card-body text-secondary">
                <h5 class="card-title">${postcontent[i][3]}</h5>
              </div>
              <div class="row text-dark ms-2">
                <div class="col-2" style="color:#355764">
                  <i class="fa-solid fa-2x fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;<span style="color:white; font-size: 30px;">${postcontent[i][4]}</span>
                </div>
              </div>
            </a>
          </div>`
        }
    }
    target.innerHTML=s;
  }
  else if(document.getElementById('t').innerHTML=='Post by character'){
    show='show3'
    var target=document.getElementById('divtarget2');
    target.innerHTML='';
    var input=document.getElementById('target').value;
    if(input==''){
        return;
    }
    var  s='';
    for(let i=0;i<postchar.length;i++){
        if(postchar[i][5].toLowerCase().includes(input.toLowerCase())){
            s+=`<div class="row"><div class="card border-secondary mb-2" >
            <div class="card-header text-success">
              <a href="/profile/${postchar[i][0]}" style="text-decoration: none">
                <h5 class="card-title">${postchar[i][1]}</h5>
              </a>
            </div>
            <a href="/post/${postchar[i][2]}" style="text-decoration: none">
              <div class="card-body text-secondary">
                <h5 class="card-title">${postchar[i][3]}</h5>
              </div>
              <div class="row text-dark ms-2">
                <div class="col-2" style="color:#355764">
                  <i class="fa-solid fa-2x fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;<span style="color:white; font-size: 30px;">${postchar[i][4]}</span>
                </div>
              </div>
            </a>
          </div></div>`
        }
    }
    target.innerHTML=s;
  }
})