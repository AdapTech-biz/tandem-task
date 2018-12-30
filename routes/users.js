let express = require('express');
let router = express.Router();
let dbHelper = require('../utils/dbHelper');
let serverMethods = require('../utils/serverMethods');
let firebase = require('firebase');

let config = {
    apiKey: "AIzaSyAt_KvboflQ4QAZnS1fdi8O1vMVmt31qsc",
    authDomain: "pinup-ac1d5.firebaseapp.com",
    databaseURL: "https://pinup-ac1d5.firebaseio.com",
    projectId: "pinup-ac1d5",
    storageBucket: "pinup-ac1d5.appspot.com",
    messagingSenderId: "115970266232"
};
firebase.initializeApp(config);

/* GET users listing. */
router.get('/register', function (req, res, next) {
    res.render('register');
});

/* POST users listing. */
router.post('/register', function(req, res, next) {
    let userName = req.body.email;
    let password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(userName, password).then(function (newUser) {
      let id = newUser.user.uid;
      serverMethods.generateDBID(id, function (databaseID) {
          dbHelper.createProfile(req.body, databaseID);
      })
    });

    res.send({response: 'respond with a resource'});
});

router.post('/login', function (req, res, next) {
 // console.log(req.body.token);
    if (req.body.token === undefined){
        let userName = req.body.username;
        let password = req.body.password;
        firebase.auth().signInWithEmailAndPassword(userName, password).then(function (user) {
            user.user.getIdToken(true).then(function (value) {
                // return serverMethods.serverTokenAuth(value); //prints the UID from Firebase
                serverMethods.serverTokenAuth(value, function (firebaseID) {
                    serverMethods.generateDBID(firebaseID, function (profileID) {
                        res.redirect('/profiles/' + profileID);

                    });
                });
            });
        }).catch(function (reason) {
            console.log(reason)
        });
    }else {
        let token = req.body.token;
        serverMethods.serverTokenAuth(token, function (firebaseID) {
            serverMethods.generateDBID(firebaseID, function (profileID) {
                dbHelper.retriveAllUserInfo(profileID, function (returnedDBSearch) {
                    res.send(returnedDBSearch);
                });
            });
        })
    }


});

router.post("/recovery", function (req, res) {

    res.send({message: "Email Sent", redirect: "/"});
});


/* PUT users listings. */


module.exports = router;