let express = require('express');
let router = express.Router();
let dbHelper = require('../utils/dbHelper');
let serverMethods = require('../utils/serverMethods');
let formidable = require('formidable');
let cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'xyd93',
    api_key: '374984796538663',
    api_secret: 'gzXNVYDMWNEEvhv1HEmkJO3wvqU'
});



/* GET users listing. */
router.get('/:id', function(req, res, next) {
    dbHelper.retriveAllUserInfo(req.params.id, function (results) {
       // res.send(results);
       res.render('profileView', {userData: results})
    });

});

router.patch('/:id', function(req, res, next){
    let profileID = req.params.id;
    let updates = req.body;


   dbHelper.updateProfile(profileID, updates, function (updateStatus) {

       if (req.body.mobile === undefined){ //web base request
           updateStatus ? res.redirect(`/profiles/${req.body.profileID}`) : res.redirect(`${req.get('host')} ${req.originalUrl}`);
       }else { //mobile based request
           updateStatus ? res.status(200).json({message: "Upload Complete"}) : res.status(500).json({message: "Error!"});
       }

   });

});

router.get('/:id/upload', function (req, res, next) {
    let profileID = req.params.id;
    console.log(profileID);
   dbHelper.findProfileWithID(profileID, function (profile) {
       console.log(profile);
       res.render('upload', {userProfile: profile});
   })
});

router.patch('/:id/upload', function (req, res, next) {

    let userID = req.params.id;
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
        let oldpath = files.userPic.path;
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
