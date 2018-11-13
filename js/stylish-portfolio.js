
//pageCountsRef.push(postData);




(function($) {
  "use strict"; // Start of use strict

  // Closes the sidebar menu
  $(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
    $(this).toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('#sidebar-wrapper .js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
    $(".menu-toggle").removeClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

})(jQuery); // End of use strict

var token = '216613872.1677ed0.52c7e99b192d45218a380c211d808a6f',
num_photos = 8;

$.ajax({
url: 'https://api.instagram.com/v1/users/self/media/recent',
dataType: 'jsonp',
type: 'GET',
data: {access_token: token, count: num_photos},
success: function(data){
    console.log(data);
    for( x in data.data ){
        $('ol').append('<li><img src="'+data.data[x].images.low_resolution.url+'"></li>');
    }
},
error: function(data){
    console.log(data);
}
});

//firebase
var config = {
  apiKey: "AIzaSyBrlMNBa5aiM8aTN44j7HnfekliYYYjLbA",
  authDomain: "hitcounter-73e0a.firebaseapp.com",
  databaseURL: "https://hitcounter-73e0a.firebaseio.com",
  projectId: "hitcounter-73e0a",
  storageBucket: "hitcounter-73e0a.appspot.com",
  messagingSenderId: "799328088390"
};
firebase.initializeApp(config);

//rootref is a refernec eto the whole firebase database
const rootRef = firebase.database().ref();
//page count ref \s is the node that tracks the hits
const pageCountsRef = rootRef.child("pageCounts");

//gets the key and current hit count
let getHistory = new Promise(function(resolve, reject){

let obj = {};
pageCountsRef.orderByChild("page").equalTo(location.pathname).once("value", function(snapshot){
snapshot.forEach(function (child){
  obj = {
    key: child.key,
    count: child.val().count
  }
});
  if(obj){
    resolve(obj);
  }else{
    reject(error);
  }
})
});
getHistory.then(function(fromResolve){
  var key = fromResolve.key;
  var pastcounts = fromResolve.count;
  // if key is undefined then create new key for database item.
  if(key == undefined){
    key = pageCountsRef.push().key;
    pastcounts = 0;
  }
//total hits to date
counts = pastcounts+1;
var postData = {
  page: location.pathname,
  count: counts,
  lastvisit: firebase.database.ServerValue.TIMESTAMP,
  lastreffer: document.referrer
}
var updates = {};
updates["/pageCounts/"+key]=postData;
rootRef.update(updates);
}).catch(function(fromReject){
console.log(error);
})




  



