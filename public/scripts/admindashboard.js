
window.setTimeout(loading, 200);

function loading(){
    document.getElementById('loader').style.display = 'none';
    document.getElementById('mainbody').style.display = 'block';
}
function contentdelete(id,element,parent){
    fetch(`/admindashboard/contentdelete?id=${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    }) 
    .catch(err=>console.log(err))
}
function animeRecomDelete(id,element,parent){
    fetch(`/adminrecom/anime/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    }) 
    .catch(err=>console.log(err))
}
function mangaRecomDelete(id,element,parent){
    fetch(`/adminrecom/manga/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    }) 
    .catch(err=>console.log(err))
}
function lightnovelRecomDelete(id,element,parent){
    fetch(`/adminrecom/lightnovel/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    }) 
    .catch(err=>console.log(err))
}

function movieRecomDelete(id,element,parent){
    fetch(`/adminrecom/movie/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    }) 
    .catch(err=>console.log(err))
}

function userdelete(id,element,parent){
    fetch(`/admindashboard/delete?id=${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    })
    .catch(err=>console.log(err))
}

function submissionDelete(id,element,parent){
   
    fetch(`/submission/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    })
    .catch(err=>console.log(err))
}

function movieRecomAdd(id,element,parent){
    const lock=document.getElementById("movielock"+id).checked;
    sessionStorage.setItem("_x_moviecount", parseInt(sessionStorage.getItem("_x_moviecount"))+1);
        // console.log(id)
        // console.log(lock)
        fetch(`/adminrecom/movie/${id}`,{
            method: 'POST',
            body: JSON.stringify({lock:lock}),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            swal({
                title: "Done!",
                text: `${data.msg}`,
                icon: "success",
                button: "Ok",
            });
            let i = sessionStorage.getItem("_x_moviecount");
            var dev=document.getElementById('addmoviecontent');
            dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="movie${i}">
            <img
              src="${data.image}"
              class="card-img rounded-circle"
              alt="..."
              style="height: 150px; width: 150px;"
            />
            <div class="card-body" style="height: 95px">
              <div
                class="text-wrap"
                style="width: 7rem; font-style: italic"
              >
                <p class="text-light">${data.title}</p>
              </div>
            </div>
            <div class="card-footer" style="padding:0 ;">
              <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#moviemodal${i}">
                see dtails
              </button>
            </div>
          </div>`;
            dev=document.getElementById('v-tabs-movie');
            dev.innerHTML+=`<div class="modal fade" id="moviemodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Movie Content</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <section class="bg-light">
                  <div class="container">
                      <div class="row">
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div class="card card-style1 border-0">
                                  <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                      <div class="row align-items-center">
                                          <div class="col-lg-6 mb-4 mb-lg-0">
                                              <img src="${data.image}" alt="..." class="img-thumbnail">
                                          </div>
                                          <div class="col-lg-6 px-xl-10">
                                              <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                  <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                              </div>
                                              <ul class="list-unstyled mb-1-9">
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Movie</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Producers:</span> ${data.producers}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Licensors:</span> ${data.licensors}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Studios:</span> ${data.studios}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Source:</span> ${data.source}</li>
                                                  </ul>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div>
                                  <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                  <pre>${data.synopsis}</pre>
                              </div>
                
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <!-- <a href="/admindashboard/contentdelete?id=<%=locals.movie[i][0]%>"> -->
                              <button type="button" class="btn btn-danger contentdelete" onclick="contentdelete(${data.id},this,'movie${i}')" data-bs-dismiss="modal">
                                Delete Content
                              </button>
                            <!-- </a> -->
                          </div>
                      </div>
                  </div>
              </section>
              </div>
            </div>
            </div>
            </div>`;
        })
        .then((r)=>{
            document.getElementById(parent).remove();
            return;
        }) 
        .catch(err=>console.log(err))

    return false;
}

function lightnovelRecomAdd(id,element,parent){
    const lock=document.getElementById("lightnovellock"+id).checked;
    sessionStorage.setItem("_x_lightnovelcount", parseInt(sessionStorage.getItem("_x_lightnovelcount"))+1);
        fetch(`/adminrecom/lightnovel/${id}`,{
            method: 'POST',
            body: JSON.stringify({lock:lock}),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            swal({
                title: "Done!",
                text: `${data.msg}`,
                icon: "success",
                button: "Ok",
            });
            let i = sessionStorage.getItem("_x_lightnovelcount");
            var dev=document.getElementById('addlightnovelcontent');
            dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="lightnovel${i}">
            <img
              src="${data.image}"
              class="card-img rounded-circle"
              alt="..."
              style="height: 150px; width: 150px;"
            />
            <div class="card-body" style="height: 95px">
              <div
                class="text-wrap"
                style="width: 7rem; font-style: italic"
              >
                <p class="text-light">${data.title}</p>
              </div>
            </div>
            <div class="card-footer" style="padding:0 ;">
              <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#lightnovelmodal${i}">
                see dtails
              </button>
            </div>
          </div>`;
            dev=document.getElementById('v-tabs-lightnovel');
            dev.innerHTML+=`<div class="modal fade" id="lightnovelmodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Lightnovel Content</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <section class="bg-light">
                  <div class="container">
                      <div class="row">
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div class="card card-style1 border-0">
                                  <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                      <div class="row align-items-center">
                                          <div class="col-lg-6 mb-4 mb-lg-0">
                                              <img src="${data.image}" alt="..." class="img-thumbnail">
                                          </div>
                                          <div class="col-lg-6 px-xl-10">
                                              <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                  <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                              </div>
                                              <ul class="list-unstyled mb-1-9">
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Lightnovel</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Status:</span> ${data.status}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Genres:</span> ${data.genres}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Author-Artist:</span> ${data.authors}</li>
                                                  </ul>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div>
                                  <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                  <pre>${data.synopsis}</pre>
                              </div>
                
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <!-- <a href="/admindashboard/contentdelete?id=<%=locals.lightnovel[i][0]%>"> -->
                              <button type="button" class="btn btn-danger contentdelete" onclick="contentdelete(${data.id},this,'lightnovel${i}')" data-bs-dismiss="modal">
                                Delete Content
                              </button>
                            <!-- </a> -->
                          </div>
                      </div>
                  </div>
              </section>
              </div>
            </div>
            </div>
            </div>`;
        })
        .then((r)=>{
            document.getElementById(parent).remove();
            return;
        }) 
        .catch(err=>console.log(err))
    return false;
}

function mangaRecomAdd(id,element,parent){
    const lock=document.getElementById("mangalock"+id).checked;
    sessionStorage.setItem("_x_mangacount", parseInt(sessionStorage.getItem("_x_mangacount"))+1);
        fetch(`/adminrecom/manga/${id}`,{
            method: 'POST',
            body: JSON.stringify({lock:lock}),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            swal({
                title: "Done!",
                text: `${data.msg}`,
                icon: "success",
                button: "Ok",
            });
            let i = sessionStorage.getItem("_x_mangacount");
            var dev=document.getElementById('addmangacontent');
            dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="manga${i}">
            <img
              src="${data.image}"
              class="card-img rounded-circle"
              alt="..."
              style="height: 150px; width: 150px;"
            />
            <div class="card-body" style="height: 95px">
              <div
                class="text-wrap"
                style="width: 7rem; font-style: italic"
              >
                <p class="text-light">${data.title}</p>
              </div>
            </div>
            <div class="card-footer" style="padding:0 ;">
              <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#mangamodal${i}">
                see dtails
              </button>
            </div>
          </div>`;
            dev=document.getElementById('v-tabs-manga');
            dev.innerHTML+=`<div class="modal fade" id="mangamodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Manga Content</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <section class="bg-light">
                  <div class="container">
                      <div class="row">
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div class="card card-style1 border-0">
                                  <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                      <div class="row align-items-center">
                                          <div class="col-lg-6 mb-4 mb-lg-0">
                                              <img src="${data.image}" alt="..."class="img-thumbnail">
                                          </div>
                                          <div class="col-lg-6 px-xl-10">
                                              <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                  <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                              </div>
                                              <ul class="list-unstyled mb-1-9">
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Manga</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Status:</span> ${data.status}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Genres:</span> ${data.genres}</li>
                                                  <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Author-Artist:</span> ${data.authors_artists}</li>
                                                  </ul>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-lg-12 mb-4 mb-sm-5">
                              <div>
                                  <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                  <pre>${data.synopsis}</pre>
                              </div>
                
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <!-- <a href="/admindashboard/contentdelete?id=<%=locals.manga[i][0]%>"> -->
                              <button type="button" class="btn btn-danger" onclick="contentdelete(${data.id},this,'manga${i}')" data-bs-dismiss="modal">
                                Delete Content
                              </button>
                            <!-- </a> -->
                          </div>
                      </div>
                  </div>
              </section>
              </div>
            </div>
            </div>
            </div>`;
        })
        .then((r)=>{
            document.getElementById(parent).remove();
            return;
        }) 
        .catch(err=>console.log(err))
    return false;
}

function animeRecomAdd(id,element,parent){
    const lock=document.getElementById("animelock"+id).checked;
    console.log(typeof sessionStorage.getItem("_x_animecount"))
    sessionStorage.setItem("_x_animecount", parseInt(sessionStorage.getItem("_x_animecount"))+1);
    console.log(lock);
        fetch(`/adminrecom/anime/${id}`,{
            method: 'POST',
            body: JSON.stringify({lock:lock}),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.locked)
            swal({
                title: "Done!",
                text: `${data.msg}`,
                icon: "success",
                button: "Ok",
            });
            let i = sessionStorage.getItem("_x_animecount");
            var dev=document.getElementById('addanimecontent');
            dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="anime${i}">
            <img
              src="${data.image}"
              class="card-img rounded-circle"
              alt="..."
              style="height: 150px; width: 150px;"
            />
            <div class="card-body" style="height: 95px">
              <div
                class="text-wrap"
                style="width: 7rem; font-style: italic"
              >
                <p class="text-light">${data.title}</p>
              </div>
            </div>
            <div class="card-footer" style="padding:0 ;">
              <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#exampleModal${i}">
                see dtails
              </button>
            </div>
          </div>`;
            dev=document.getElementById('v-tabs-anime');
            dev.innerHTML+=`<div class="modal fade" id="exampleModal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Anime Content</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <section class="bg-light">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12 mb-4 mb-sm-5">
                                <div class="card card-style1 border-0">
                                    <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                        <div class="row align-items-center">
                                            <div class="col-lg-6 mb-4 mb-lg-0">
                                                <img src="${data.image}" alt="..." class="img-thumbnail">
                                            </div>
                                            <div class="col-lg-6 px-xl-10">
                                                <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                    <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                                </div>
                                                <ul class="list-unstyled mb-1-9">
                                                    <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Anime</li>
                                                    <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Episodes:</span> ${data.episode_no}</li>
                                                    <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Locked:</span> ${data.locked}</li>
                                                    <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Studios:</span> ${data.studios}</li>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 mb-4 mb-sm-5">
                                <div>
                                    <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                    <pre>${data.synopsis}</pre>
                                </div>
                  
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                              <!-- <a href="/admindashboard/contentdelete?id=<%=locals.anime[i][0]%>"> -->
                                <button type="button" class="btn btn-danger" onclick="contentdelete(${data.id},this,'anime${i}')" data-bs-dismiss="modal">
                                  Delete Content
                                </button>
                              <!-- </a> -->
                            </div>
                        </div>
                    </div>
                </section>
                </div>
              </div>
            </div>
          </div>`;
        })
        .then((r)=>{
            document.getElementById(parent).remove();
            return;
        }) 
        .catch(err=>console.log(err))
    return false;
}

function animeAdd(){
    //const lock=document.getElementById("animelock"+id).value;
    sessionStorage.setItem("_x_animecount", parseInt(sessionStorage.getItem("_x_animecount"))+1);
    const form = document.getElementById('animeadd');
    const formdata=new FormData(form);
    // // const file=document.getElementById("animelock"+id).value;
    // console.log(formdata.get('pic'));
    // console.log(formdata.get('name'));
    const f=new FormData()
    f.append('title', formdata.get('title'));
    f.append('cover_pic', formdata.get('cover_pic'));
    f.append('source_id_1', formdata.get('source_id_1'));
    f.append('synopsis', formdata.get('synopsis'));
    f.append('episode_no', formdata.get('episode_no'));
    f.append('status', formdata.get('status'));
    f.append('air_start_date', formdata.get('air_start_date'));
    f.append('air_end_date', formdata.get('air_end_date'));
    f.append('duration', formdata.get('duration'));
    f.append('season', formdata.get('season'));
    f.append('studios', formdata.get('studios'));
    f.append('licensors', formdata.get('licensors'));
    f.append('producers', formdata.get('producers'));
    f.append('source', formdata.get('source'));
    f.append('genres', formdata.get('genres'));
    f.append('lock', formdata.get('lock'));
    fetch(`/contentadd/anime`,{
        method: 'POST',
        body:f
    })
    .then(res=>res.json())
    .then(data=>{
        swal({
            title: "Done!",
            text: `${data.msg}`,
            icon: "success",
            button: "Ok",
        });
        let i = sessionStorage.getItem("_x_animecount");
        var dev=document.getElementById('addanimecontent');
        dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="anime${i}">
        <img
            src="${data.image}"
            class="card-img rounded-circle"
            alt="..."
            style="height: 150px; width: 150px;"
        />
        <div class="card-body" style="height: 95px">
            <div
            class="text-wrap"
            style="width: 7rem; font-style: italic"
            >
            <p class="text-light">${data.title}</p>
            </div>
        </div>
        <div class="card-footer" style="padding:0 ;">
            <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#exampleModal${i}">
            see dtails
            </button>
        </div>
        </div>`;
        dev=document.getElementById('v-tabs-anime');
        dev.innerHTML+=`<div class="modal fade" id="exampleModal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Anime Content</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <section class="bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div class="card card-style1 border-0">
                                <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                    <div class="row align-items-center">
                                        <div class="col-lg-6 mb-4 mb-lg-0">
                                            <img src="${data.image}" alt="..." class="img-thumbnail">
                                        </div>
                                        <div class="col-lg-6 px-xl-10">
                                            <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                            </div>
                                            <ul class="list-unstyled mb-1-9">
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Anime</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Episodes:</span> ${data.episode_no}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Locked:</span> ${data.locked}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Studios:</span> ${data.studios}</li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div>
                                <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                <pre>${data.synopsis}</pre>
                            </div>
                
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <!-- <a href="/admindashboard/contentdelete?id=<%=locals.anime[i][0]%>"> -->
                            <button type="button" class="btn btn-danger" onclick="contentdelete(${data.id},this,'anime${i}')" data-bs-dismiss="modal">
                                Delete Content
                            </button>
                            <!-- </a> -->
                        </div>
                    </div>
                </div>
            </section>
            </div>
            </div>
        </div>
        </div>`;
        
    })
    .catch(err=>console.log(err))
    form.reset();
    return false;
}

function mangaAdd(){
    sessionStorage.setItem("_x_mangacount", parseInt(sessionStorage.getItem("_x_mangacount"))+1);
    const form = document.getElementById('mangaadd');
    const formdata=new FormData(form);
    const f=new FormData()
    f.append('title', formdata.get('title'));
    f.append('cover_pic', formdata.get('cover_pic'));
    f.append('source_id_1', formdata.get('source_id_1'));
    f.append('synopsis', formdata.get('synopsis'));
    f.append('status', formdata.get('status'));
    f.append('volumes', formdata.get('volumes'));
    f.append('chapters', formdata.get('chapters'));
    f.append('authors_artists', formdata.get('authors_artists'));
    f.append('genres', formdata.get('genres'));
    f.append('lock', formdata.get('lock'));
    fetch(`/contentadd/manga`,{
        method: 'POST',
        body:f
    })
    .then(res=>res.json())
    .then(data=>{
        swal({
            title: "Done!",
            text: `${data.msg}`,
            icon: "success",
            button: "Ok",
        });
        let i = sessionStorage.getItem("_x_mangacount");
        var dev=document.getElementById('addmangacontent');
        dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="manga${i}">
        <img
            src="${data.image}"
            class="card-img rounded-circle"
            alt="..."
            style="height: 150px; width: 150px;"
        />
        <div class="card-body" style="height: 95px">
            <div
            class="text-wrap"
            style="width: 7rem; font-style: italic"
            >
            <p class="text-light">${data.title}</p>
            </div>
        </div>
        <div class="card-footer" style="padding:0 ;">
            <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#mangamodal${i}">
            see dtails
            </button>
        </div>
        </div>`;
        dev=document.getElementById('v-tabs-manga');
        dev.innerHTML+=`<div class="modal fade" id="mangamodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Manga Content</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <section class="bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div class="card card-style1 border-0">
                                <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                    <div class="row align-items-center">
                                        <div class="col-lg-6 mb-4 mb-lg-0">
                                            <img src="${data.image}" alt="..."class="img-thumbnail">
                                        </div>
                                        <div class="col-lg-6 px-xl-10">
                                            <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                            </div>
                                            <ul class="list-unstyled mb-1-9">
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Manga</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Status:</span> ${data.status}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Genres:</span> ${data.genres}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Author-Artist:</span> ${data.authors_artists}</li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div>
                                <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                <pre>${data.synopsis}</pre>
                            </div>
            
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <!-- <a href="/admindashboard/contentdelete?id=<%=locals.manga[i][0]%>"> -->
                            <button type="button" class="btn btn-danger" onclick="contentdelete(${data.id},this,'manga${i}')" data-bs-dismiss="modal">
                            Delete Content
                            </button>
                        <!-- </a> -->
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>
        </div>
        </div>`;
    })
    .catch(err=>console.log(err))
    form.reset();
    return false;
}

function lightnovelAdd(){
    sessionStorage.setItem("_x_lightnovelcount", parseInt(sessionStorage.getItem("_x_lightnovelcount"))+1);
    const form = document.getElementById('lightnoveladd');
    const formdata=new FormData(form);
    const f=new FormData()
    f.append('title', formdata.get('title'));
    f.append('cover_pic', formdata.get('cover_pic'));
    f.append('source_id_1', formdata.get('source_id_1'));
    f.append('synopsis', formdata.get('synopsis'));
    f.append('status', formdata.get('status'));
    f.append('volumes', formdata.get('volumes'));
    f.append('publish_date', formdata.get('publish_date'));
    f.append('authors', formdata.get('authors'));
    f.append('genres', formdata.get('genres'));
    f.append('lock', formdata.get('lock'));
    fetch(`/contentadd/lightnovel`,{
        method: 'POST',
        body:f
    })
    .then(res=>res.json())
    .then(data=>{
        swal({
            title: "Done!",
            text: `${data.msg}`,
            icon: "success",
            button: "Ok",
        });
        let i = sessionStorage.getItem("_x_lightnovelcount");
        var dev=document.getElementById('addlightnovelcontent');
        dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="lightnovel${i}">
        <img
            src="${data.image}"
            class="card-img rounded-circle"
            alt="..."
            style="height: 150px; width: 150px;"
        />
        <div class="card-body" style="height: 95px">
            <div
            class="text-wrap"
            style="width: 7rem; font-style: italic"
            >
            <p class="text-light">${data.title}</p>
            </div>
        </div>
        <div class="card-footer" style="padding:0 ;">
            <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#lightnovelmodal${i}">
            see dtails
            </button>
        </div>
        </div>`;
        dev=document.getElementById('v-tabs-lightnovel');
        dev.innerHTML+=`<div class="modal fade" id="lightnovelmodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Lightnovel Content</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <section class="bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div class="card card-style1 border-0">
                                <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                    <div class="row align-items-center">
                                        <div class="col-lg-6 mb-4 mb-lg-0">
                                            <img src="${data.image}" alt="..." class="img-thumbnail">
                                        </div>
                                        <div class="col-lg-6 px-xl-10">
                                            <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                            </div>
                                            <ul class="list-unstyled mb-1-9">
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Lightnovel</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Status:</span> ${data.status}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Genres:</span> ${data.genres}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Author-Artist:</span> ${data.authors}</li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div>
                                <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                <pre>${data.synopsis}</pre>
                            </div>
            
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <!-- <a href="/admindashboard/contentdelete?id=<%=locals.lightnovel[i][0]%>"> -->
                            <button type="button" class="btn btn-danger contentdelete" onclick="contentdelete(${data.id},this,'lightnovel${i}')" data-bs-dismiss="modal">
                            Delete Content
                            </button>
                        <!-- </a> -->
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>
        </div>
        </div>`;
    })
    .catch(err=>console.log(err))
    form.reset();
    return false;
}

function movieAdd(){
    sessionStorage.setItem("_x_moviecount", parseInt(sessionStorage.getItem("_x_moviecount"))+1);
    const form = document.getElementById('movieadd');
    const formdata=new FormData(form);
    const f=new FormData()
    f.append('title', formdata.get('title'));
    f.append('cover_pic', formdata.get('cover_pic'));
    f.append('source_id_1', formdata.get('source_id_1'));
    f.append('synopsis', formdata.get('synopsis'));
    f.append('source', formdata.get('source'));
    f.append('release_date', formdata.get('release_date'));
    f.append('duration', formdata.get('duration'));
    f.append('studios', formdata.get('studios'));
    f.append('licensors', formdata.get('licensors'));
    f.append('producers', formdata.get('producers'));
    f.append('lock', formdata.get('lock'));
    fetch(`/contentadd/movie`,{
        method: 'POST',
        body:f
    })
    .then(res=>res.json())
    .then(data=>{
        swal({
            title: "Done!",
            text: `${data.msg}`,
            icon: "success",
            button: "Ok",
        });
        let i = sessionStorage.getItem("_x_moviecount");
        var dev=document.getElementById('addmoviecontent');
        dev.innerHTML+=`<div class="card text-white bg-dark me-3 mb-3" id="movie${i}">
        <img
            src="${data.image}"
            class="card-img rounded-circle"
            alt="..."
            style="height: 150px; width: 150px;"
        />
        <div class="card-body" style="height: 95px">
            <div
            class="text-wrap"
            style="width: 7rem; font-style: italic"
            >
            <p class="text-light">${data.title}</p>
            </div>
        </div>
        <div class="card-footer" style="padding:0 ;">
            <button type="button" class="btn btn-info w-100" data-bs-toggle="modal" data-bs-target="#moviemodal${i}">
            see dtails
            </button>
        </div>
        </div>`;
        dev=document.getElementById('v-tabs-movie');
        dev.innerHTML+=`<div class="modal fade" id="moviemodal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Movie Content</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <section class="bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div class="card card-style1 border-0">
                                <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                    <div class="row align-items-center">
                                        <div class="col-lg-6 mb-4 mb-lg-0">
                                            <img src="${data.image}" alt="..." class="img-thumbnail">
                                        </div>
                                        <div class="col-lg-6 px-xl-10">
                                            <div class="bg-secondary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                <h3 class="h6 text-white mb-3 ms-3 me-3 mt-3">${data.title}</h3>
                                            </div>
                                            <ul class="list-unstyled mb-1-9">
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Type:</span> Movie</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Producers:</span> ${data.producers}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Licensors:</span> ${data.licensors}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Studios:</span> ${data.studios}</li>
                                                <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Source:</span> ${data.source}</li>
                                                </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-4 mb-sm-5">
                            <div>
                                <span class="section-title text-primary mb-3 mb-sm-4">About This</span>
                                <pre>${data.synopsis}</pre>
                            </div>
            
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <!-- <a href="/admindashboard/contentdelete?id=<%=locals.movie[i][0]%>"> -->
                            <button type="button" class="btn btn-danger contentdelete" onclick="contentdelete(${data.id},this,'movie${i}')" data-bs-dismiss="modal">
                            Delete Content
                            </button>
                        <!-- </a> -->
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>
        </div>
        </div>`;
    })
    .catch(err=>console.log(err))
    form.reset();
    return false;
}

// const form = document.getElementsByClassName("movierecom")
// for(let i=0;i<form.length;i++){
//     form[i].addEventListener("submit",(event)=>{
//         event.preventDefault();
//         //console.log(form)
//         // const formdata=new FormData(form);
//         // console.log(formdata)
        
//         const lock=document.getElementById("movielock"+).value;
        
//         console.log(id)
//         console.log(lock)
//         fetch(`/adminrecom/movie/${id}`,{
//             method: 'POST',
//             body: JSON.stringify({lock:lock}),
//             headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//         })
//         .then(res=>res.json())
//         .then(data=>{
//             // console.log(data)
//             swal({
//                 title: "Done!",
//                 text: `${data.msg}`,
//                 icon: "success",
//                 button: "Ok",
//             });
//         })
//         .catch(err=>console.log(err))
//     });
// }

function transactionDelete(id,element,parent){
    fetch(`/nkash/delete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    })
    .catch(err=>console.log(err))
}

function transactionAdd(id,element,parent,user_id,inp){
    const text=document.getElementById(inp).value;
    //console.log(text,id,user_id,inp);
    fetch(`nkash/balanceadd/${user_id}/${id}`,{
        method: 'POST',
        body: JSON.stringify(
            {amount:text}
        ),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    })
    .catch(err=>console.log(err))
}

function reportDelete(id,element,parent){
    fetch(`/post/reportdelete/${id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        return;
    })
    .catch(err=>console.log(err))
}

function postDelete(post_id,element,parent){
    fetch(`/post/delete/${post_id}`)
  .then((response) => response.json())
  .then((data) => {
    swal({
        title: "Done!",
        text: `${data.msg}`,
        icon: "success",
        button: "Ok",
    });
    })
    .then((r)=>{
        document.getElementById(parent).remove();
        const reports = document.querySelectorAll(`.myreporttr${post_id}`);
            reports.forEach(report => {
            report.remove();
        });
        return;
    })
    .catch(err=>console.log(err))
}