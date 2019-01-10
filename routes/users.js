var express = require('express');
var router = express.Router();
var dbHelper = require('../utils/dbHelper');
var serverMethods = require('../utils/serverMethods');
var firebase = require('firebase');
var createSessionCookie = require('../middleware/createSessionCookie');
var setSessionCookie = require('../middleware/setSessionCookie');
var firebaseLogin = require('../middleware/firebaseLogin');
var voidSessionCookie = require('../middleware/voidSessionCookie');

var config = {
    apiKey: process.env.FBKEY,
    authDomain: process.env.FBauthDomain,
    databaseURL: process.env.FBDBURL,
    projectId: process.env.FBprojectID,
    storageBucket: process.env.FBstorageBucket,
    messagingSenderId: process.env.FBmessagingSenderID
};
firebase.initializeApp(config);

/* GET users listing. */
router.get('/register', function (req, res, next) {
    res.render('register');
});

/* POST users listing. */
router.post('/register', function(req, res, next) {
    var userName = req.body.email;
    var password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(userName, password).then(function (newUser) {
      var id = newUser.user.uid;
      serverMethods.generateDBID(id, function (databaseID) {
          dbHelper.createProfile(req.body, databaseID);
      })
    });

    res.send({response: 'respond with a resource'});
});



router.post('/login', firebaseLogin, createSessionCookie,  function (req, res, next) {
 // console.log(req.body.token);
 //    if (req.body.token === undefined){ //api call from web
        var userToken = res.locals.token;

        serverMethods.serverTokenAuth(userToken, function (fbID) {
           serverMethods.generateDBID(fbID, function (profileID) {
               res.locals.user = profileID;
               res.redirect('/profiles/' + profileID);
           })
        });

    // }else { //api call from phone app
    //     var token = req.body.token;
    //     serverMethods.serverTokenAuth(token, function (firebaseID) {
    //         serverMethods.generateDBID(firebaseID, function (profileID) {
    //             dbHelper.retriveAllUserInfo(profileID, function (returnedDBSearch) {
    //                 res.send(returnedDBSearch);
    //             });
    //         });
    //     })
    // }
});

router.post('/session', createSessionCookie, function (req, res, next) {
    var token = req.body.token;
    serverMethods.serverTokenAuth(token, function (firebaseID) {
        serverMethods.generateDBID(firebaseID, function (profileID) {
            dbHelper.retriveAllUserInfo(profileID, function (returnedDBSearch) {
                res.send(returnedDBSearch);
            });
        });
    })
});

router.post("/recovery", function (req, res) {

    res.send({message: "Email Sent", redirect: "/"});
});

router.use('/logout', voidSessionCookie);
router.get('/logout', function (req, res) {

});


/* PUT users listings. */


module.exports = router;