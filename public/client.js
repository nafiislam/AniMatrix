if (window.Notification) {
  Notification.requestPermission((status) => {
    console.log('Status of the request:', status);
  });
}
addEventListener("load", async () => {
    //let sw = await navigator.serviceWorker.register('/js/serviceworker.js');

    navigator.serviceWorker
      .register("/serviceworker.js", { scope: "/" })
      .then(function (registration) {
        console.log("Service Worker Registered");
      })
      .catch(function (err) {
        console.log("Service Worker Failed to Register", err);
      });
    //console.log(sw);
  });
  // async function subscribe() {
  //   if('serviceWorker' in navigator){
  //       console.log("ami");
  //       let sw = await navigator.serviceWorker.ready;
  //       //console.log(sw);
  //       let push = await sw.pushManager.subscribe({
  //       userVisibleOnly: true,
  //       applicationServerKey:
  //           "BIT3aYCOJdb5GnWeOXBtAG3WVJPtD_YdXWDFwKu4yrU6O9tFfsH3yKm1c-UeKFncwchlbgPGoAM-88HRyEfaSTs",
  //       });
  //       //console.log(push);
  //       console.log(JSON.stringify(push));
  //       await fetch("/naf/subscribe", {
  //       method: "POST",
  //       body: JSON.stringify(push),
  //       headers: {
  //           "content-type": "application/json",
  //       },
  //       });
  //   }
  // }