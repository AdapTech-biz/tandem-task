var express = require('express');
var router = express.Router();
var dbHelper = require('../utils/dbHelper');
var checkSessionCookie = require('../middleware/checkSessionCookie');

var serverMethods = require('../utils/serverMethods');
var formidable = require('formidable');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDSECRET
});

router.use(checkSessionCookie);

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    dbHelper.retriveAllUserInfo(req.params.id, function (results) {
        console.log(req.session.userCookie);
        res.locals.token = "valid";
        // res.locals.user = req.locals.user;
       res.render('profileView', {userData: results})
    });

});

router.patch('/:id', function(req, res, next){
    var profileID = req.params.id;
    var updates = req.body;
    if (updates.mobile !== undefined)
     delete  updates["mobile"];


   dbHelper.updateProfile(profileID, updates, function (updateStatus) {

       if (req.body.mobile === undefined){ //web base request
           updateStatus ? res.redirect(`/profiles/${req.body.profileID}`) : res.redirect(`${req.get('host')} ${req.originalUrl}`);
       }else { //mobile based request
           updateStatus ? res.status(200).json({message: "Upload Complete"}) : res.status(500).json({message: "Error!"});
       }

   });

});

router.get('/:id/upload', function (req, res, next) {
    var profileID = req.params.id;
    console.log(profileID);
   dbHelper.findProfileWithID(profileID, function (profile) {
       console.log(profile);
       res.render('upload', {userProfile: profile});
   })
});

router.patch('/:id/upload', function (req, res, next) {

    var userID = req.params.id;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
        var oldpath = files.userPic.path;
        cloudinary.v2.uploader.upload(oldpath,  {
            public_id: userID,
            upload_preset: 'ProfileImage'
        }, function(error, result){
            console.log(result, error);
            dbHelper.updateProfile(userID, {pictureURL: result.secure_url}, function (successful) {
               successful ? res.redirect('/profiles/' + userID + '/upload') : res.redirect('/profiles/' + userID )
            });

        });

    });
});

module.exports = router;
