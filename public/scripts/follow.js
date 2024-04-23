function follow(id){
    fetch(`/profile/follow/${id}`)
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
        // sessionStorage.setItem("_x_type","followed");
        return;
    }) 
    .catch(err=>console.log(err))
}
function unfollow(id){
    fetch(`/profile/unfollow/${id}`)
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
        // sessionStorage.setItem("_x_type","follow");
        return;
    }) 
    .catch(err=>console.log(err))
}