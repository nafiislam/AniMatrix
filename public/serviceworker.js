self.addEventListener("push", e => {
    // console.log(data)
    const data = e.data.json();
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: `nkash account for ${data.username} with 100 power`, //the body of the push notification
            image: "https://pixabay.com/vectors/bell-notification-communication-1096280/",
            icon: "http://drive.google.com/uc?export=view&id=1o9kuyGiESu75927u62JyKPArQsy1o49C" // icon 
        }
    );
});