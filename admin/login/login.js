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
  import("../../env/env.js").then((env) => {
    var vals = env.environment.apiKey.split(',')
    var keys = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    var firebaseConfig = {};
    for (let i = 0; i < keys.length; i++) {
      firebaseConfig[keys[i]] = vals[i]
    } 
    firebase.initializeApp(firebaseConfig);
  })
}

function login() {
  firebase.auth().signOut()
  
  const email = document.getElementById("usernameInput").value.toLowerCase().replaceAll(" ", "-") + "@dungeonsanddorks.github.io"
  const password = document.getElementById("passwordInput").value

  firebase.auth().signInWithEmailAndPassword(email, password).then(userObj => {
    localStorage.lastSignIn = Date.now()
    window.location.href = "/admin/"
  }).catch(error => {
    console.error(error)
  })
}