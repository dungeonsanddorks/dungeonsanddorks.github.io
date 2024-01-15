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

    firebase.auth().onAuthStateChanged(function(userObj) {
      if (!userObj) {
        window.location.href = '/admin/login/';  
      } else {
        console.log("Signed in!")
        const userUID = userObj.uid

        const db = firebase.database()
        const accessSnap = db.ref('accessLevel/' + userUID).once('value', data => {
          if (data.val().level !== 'admin') {
            window.location.href = '/admin/login/';
          }
        })
    
        // Page Setup here
      }
    })
  })
}
