
//where should this shit go....

// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyBCunFWhAmEuBd4Z2y7ViJkGf_cWNDR9UQ",
authDomain: "ed-s-virtual-bar.firebaseapp.com",
databaseURL: "https://ed-s-virtual-bar.firebaseio.com",
projectId: "ed-s-virtual-bar",
storageBucket: "ed-s-virtual-bar.appspot.com",
messagingSenderId: "709848292581",
appId: "1:709848292581:web:d3a710fe43d5aed36d880c",
measurementId: "G-RQL0QS82XZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();



var db = firebase.firestore();
var auth = firebase.auth();
var barDoc = '';

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

var live_bg_image = 'https://edsvbar.com/backgrounds/dive.jpg';
var live_bar_title = '';

var lockSlug = false;
var slug = '';

auth.onAuthStateChanged(function(user) {

  if (user) {

    // User is signed in.

  } else {

    // No user is signed in.

  }

  updateUI();


});


var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'https://edsvbar.com',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID

  ]
  // Terms of service url.
//  tosUrl: '<your-tos-url>',
  // Privacy policy url.
//  privacyPolicyUrl: '<your-privacy-policy-url>'
};


if (ui.isPendingRedirect()) {
  ui.start('#firebaseui-auth-container', uiConfig);
}


function showAuth() {
  $('#auth').modal();
  ui.start('#firebaseui-auth-container', uiConfig);
}

function createDirectory() {

  var db = firebase.firestore();
  db.collection("places").get().then(function(querySnapshot) {


    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      //  console.log(doc.id, " => ", doc.data());
      var bar = '<a href="/' + doc.id + '">'
      + '<div class="directory_bar'+ (doc.data().public ? ' public':'') +'">'
      + '<div class="directory_image" style="background-image:url(' + doc.data().background_url + ')"></div>'
      + '<div class="directory_title">' + doc.data().title + '</div>'
      + '</div>'
      + '</a>';

      $("#directory").append(bar);
    });
  });

}

var templates = ['dive', 'wine', 'tiki', 'coffee'];
var prefix = 'https://edsvbar.com/backgrounds/'
var thumbPrefix = 'https://edsvbar.com/thumbs/'

var didWeLoadFormWithACustomImage = false;

function setFormBackground(bg){

    $('#templates').empty();
    var isCustom = true;
    var passedinempty = bg.length == 0

    if(passedinempty)bg = prefix + 'dive.jpg';

    for(var i = 0; i < templates.length; i++) {
      var fn = templates[i];
      var bgurl = prefix + fn + '.jpg';
      if (bg == bgurl) isCustom = false;

      var templateselected = (bg == bgurl) ? ' selected' : '';
      var template = $('<div class="template' + templateselected + '" id="'+bgurl+'">'
        + '<div class="background_image_thumb" style="background-image:url(' + bgurl +')"></div>'
        + '<div class="template_title">' + fn + '</div>'
        + '</div>');

        template.click(function(){
            setFormBackground(this.id);
        });

        $('#templates').append(template);

    }



    if(isCustom){
      didWeLoadFormWithACustomImage = true;
    }

    if(isCustom){
          $('#custom_background_thumbnail').addClass('selected');
    } else {
        $('#custom_background_thumbnail').removeClass('selected');
    }

    if(didWeLoadFormWithACustomImage){
      $('#remove_custom_background_button').show();
      $('#custom_background_thumbnail').show();
      $('#custom_background_thumbnail').css('background-image','url('+bg+')');
    } else {
      $('#remove_custom_background_button').hide();

      $('#custom_background_thumbnail').hide();
    }

    $('#background_url').val(bg);


}

function checkAuth(){

  if(!auth.currentUser){
      showAuth();
      return false;
  }
  return true;

}

function isAdminLoggedIn() {

  if(auth.currentUser){
    if(auth.currentUser.email){
        return (auth.currentUser.email == 'filowatt@gmail.com');
    }
  }

  return false;


}

function showEditor(title, slug, background_url, public) {

  if(checkAuth() == false)return;


  $('#user_id').val(auth.currentUser.uid);
  $('#bar_title').val(title);
  $('#bar_slug').val(slug);
  $('#bar_slug').prop('enabled', (slug.length == 0));
  $('#edit').modal();
  $('#bar_public').prop('checked', public);

  setFormBackground(background_url);
  $('#remove_custom_background_button').click(function(){
    didWeLoadFormWithACustomImage = false;
    setFormBackground('');
  });
  $('#custom_background_thumbnail').click(function(){
    setFormBackground(background_url);
  });
}

function updateUI() {

  var slug = APP.conference.roomName;
  var docRef = db.collection("places").doc(slug);
  var ownerIsLoggedIn = false;
  var hasOwner = false;

  if(!slug){
    console.log('annoying guy no slug');
  }else {
    console.log('annpying guy slug ' + slug);
  }

  docRef.get().then(function(doc) {
      barDoc = doc;
      if (doc.exists) {
          live_bg_image = barDoc.data().background_url;
          $('.tile-view #remoteVideos').css("background-image", "url(" + live_bg_image + ")");
          if(barDoc.data().userid) {
            hasOwner = true;
          }
          if(barDoc.data().userid && barDoc.data().userid == auth.currentUser.uid){
            ownerIsLoggedIn = true;
          }

          var title = barDoc.data().title;
          $('#bar_sign').html(title.length > 0  ? title : slug);

          console.log("sesame Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("annoying guy  No such document!");
      }

      if(ownerIsLoggedIn || isAdminLoggedIn()) {
        $('#edit_button').show();
      }else {
        $('#edit_button').hide();
      }
      if(hasOwner){
        $('#claim_button').hide();
      }else {
        $('#claim_button').show();
      }
      $('#create_button').show();

  }).catch(function(error) {
      console.log("Error getting document:", error);
  });







  $('#edit_button').hide();
  $('#login_button').hide();
  $('#logout_button').hide();
  $('#claim_button').hide();
  $('#create_button').hide();



  var user = auth.currentUser;

  if(user){
    $('#logout_button').show();
    $('#login_button').hide();
  }else {
    $('#logout_button').hide();
    $('#login_button').show();
  }

  var dev = false;
    $("#button_menu").show();

//  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    //if(data.includes('72.23.139.211')){
      //24.239.121.12 turacks
      //24.154.127.223
      //72.23.139.211

  //  }
    //  console.log(data);
  //});

}


function saveBar() {

  var slug =  $('#bar_slug').val();
  var title = $('#bar_title').val();
  var userid = $('#user_id').val();

  if(userid.length == 0){
    alert('could not get user, try logging in again.');
    return;
  }else if(slug.length == 0){
    alert('web address cannot be empty');
    return;
  }else if(slug.lengh < 2){
    alert('web address must be at least 2 characters');
    return;
  }else if(title.length == 0){
    alert('title cannot be empty');
    return;
  }
  var docData = {
    title: title,
    slug: slug,
    public: $('#bar_public').val(),
    background_url: $('#background_url').val()

    /*
    numberExample: 3.14159265,
    dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
    arrayExample: [5, true, "hello"],
    nullExample: null,
    objectExample: {
        a: 5,
        b: {
            nested: "foo"
        }
    }
    */
};

if((isAdminLoggedIn() && slug != 'eds')){

}else {
  docData.userid = userid;
}


console.log('saving:');
console.log(docData);

db.collection("places").doc(slug).set(docData)

.then(function() {
  $.modal.close();
  window.location.href = 'https://edsvbar.com/' + slug

    //console.log("Document successfully written!");
}).catch(function(error) {
    alert(error);
    window.location.reload(true);
    //console.error("Error saving: ", error);
});


}


$( document ).ready(function() {

  var myVar = setTimeout(updateUI, 1000);

  var fileUpload = document.getElementById("file_input");
  fileUpload.addEventListener('change', function(evt) {
      let firstFile = evt.target.files[0] // upload the first file only
      let storageRef = firebase.storage().ref('backgrounds/'+ firstFile.name);
      let uploadTask = storageRef.put(firstFile);
      uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        }
      }, function(error) {
  // Handle unsuccessful uploads
      }, function(sucess) {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                      setFormBackground(downloadURL);
              });

      });

  });


$('#login_button').click(function(){
    showAuth();
});

$('#submit_button').click(function(){


  saveBar();

});


$('#logout_button').click(function(){
  auth.signOut()
  .then(function() {
    updateUI();
    // Sign-out successful.
  })
  .catch(function(error) {
    // An error happened
  });


});

$('#directory_button').click(function(){
  $('#directory').modal();
  createDirectory();
});

/*
$('#tip_button').click(function(){
  $('#tips').modal();
});
*/
$('#create_button').click(function(){
  showEditor('', '', '', true);
});

$('#claim_button').click(function(){
    showEditor(barDoc.data().title,APP.conference.roomName, barDoc.data().background_url, barDoc.data().public);
});

$('#edit_button').click(function(){

  console.log('bon jovi' + barDoc.id + 'is ' + barDoc.data().public);
  var check = barDoc.data().public ? barDoc.data().public : false;
    showEditor( barDoc.data().title, barDoc.id, barDoc.data().background_url, check);
});





$.ajax({
    url: "/bars.csv",
    async:  true,
    success: function (csvd) {
        data = $.csv.toArrays(csvd);
        console.log(data);
        for(var i=0; i < data.length; i++){
            var slug = data[i][2];
            var title = data[i][1];
            var bg = data[i][3];
            if(APP.conference.roomName == slug){
              //live_bg_image = data[i][3];
            }
            /*
            db.collection("places").doc(slug).set({
              title: title,
              background_url: bg
            }).then(function() {
                console.log("Document successfully written!");
            });
            */

        }
    },
    dataType: "text",
    complete: function () {
        //  $('.tile-view #remoteVideos').css("background-image", "url(" + live_bg_image + ")");
    }
});








  // Handler for .ready() called.
});
