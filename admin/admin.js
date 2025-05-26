if (!localStorage.isSignedIn) window.location.href = '/admin/login/';

function addElement(type, params) {
  var newElement = document.createElement(type)
  var keys = Object.keys(params)
  keys.forEach(key => {
    newElement.setAttribute(key, params[key])
  });
  return document.body.appendChild(newElement)
}

addElement('script', {
  src: "https://www.gstatic.com/firebasejs/8.2.4/firebase.js"
}).onload = function() {
  import("../env/env.js").then((env) => {
    var vals = env.environment.apiKey.split(',')
    var keys = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    var firebaseConfig = {};
    for (let i = 0; i < keys.length; i++) {
      firebaseConfig[keys[i]] = vals[i]
    } 
    firebase.initializeApp(firebaseConfig);

    if (localStorage.lastSignedIn + 3600000 < Date.now()) {
      firebase.auth().signOut();
      localStorage.removeItem('isSignedIn')
    }

    firebase.auth().onAuthStateChanged(function(userObj) {
      if (!userObj) {
        window.location.href = '/admin/login/';  
      } else {
        console.log("Signed in!")
        const userUID = userObj.uid

        const db = firebase.database()
        db.ref('userData/' + userUID).once('value', data => {
          var userData = data.val()
          if (userData.level !== 'admin' && userData.level !== 'owner') {
            window.location.href = '/admin/login/';
          } else {
            initPage(userData)
          }
        })
      }
    })
  })
}

async function initPage(userData) {
  signOutButton.innerHTML += "<br>" + userData.username
  
  // Page Setup here
}

function switchToPage(element) {
  document.querySelectorAll(".content").forEach(ele => ele.style.display = "none")
  document.querySelectorAll("#" + element.dataset.pageid).forEach(ele => ele.style.display = "flex")
}