var firebase = require("firebase");

//Firebase Client
var client = firebase.initializeApp({
    apiKey: "AIzaSyC7n0JBGtT3P5Fe4NLcJJZLDoa6BQsh7wE",
    authDomain: "balijs-4f0cb.firebaseapp.com",
    databaseURL: "https://balijs-4f0cb.firebaseio.com",
    projectId: "balijs-4f0cb",
    storageBucket: "balijs-4f0cb.appspot.com",
    messagingSenderId: "612967358575"
}, 'client');

// variabel
var auth = client.auth();
var db = client.database();

function getInitialView() {
    auth.onAuthStateChanged((user) => {
        if(user){
            return user
        }
        else {
            return 
        }
    })
  }

function sendPasswordReset(email){
    auth.sendPasswordResetEmail(email).then(()=>{
        return
    })
}

module.exports = {
    auth : auth,
    db : db,
    client : client,
    getInitialView : getInitialView
}