var formidable = require( "formidable");
var admin  = require( "firebase-admin");
var StellarSdk  = require( "stellar-sdk");
var cloudinary = require('cloudinary');


/** Database helper models
 *
 *  Unique 12-bit ID hex creation */

var generateDBID = function (identifier, callback) {
    console.log("generateDBID--Firebase UID: " + identifier);
    var generatedHash = require('crypto')
        .createHash('sha256')
        .update(identifier, 'utf8')
        .digest('hex');
    // console.log("generatedHash string " + generatedHash.substring(0, 24));
    callback(generatedHash.substring(0, 24));
    // return (generatedHash.substring(0, 24));
};



var createWallet = function (walletOwner, callback) {

    var pair = StellarSdk.Keypair.random();
    var publicKey = pair.publicKey(); //generates public and private key pair for lumen wallet
    var secret = pair.secret();


    // generates a wallet balance  = require( Stellar test network
    var request = require('request');
    request.get({
        url: 'https://friendbot.stellar.org',
        qs: {addr: publicKey},
        json: true
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.error('ERROR!', error || body);
        }
        else {
            //call populate wallet info
            callback(publicKey, secret, walletOwner)
        }
    });
};








/** Server-side token auth
 *  Verifies the auth token and returns the Database id */
var serverTokenAuth = function (idToken, callback) {

    admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            // console.log("serverTokenAuth--firebaseUID: " + decodedToken.uid);
            callback(decodedToken.uid);
            // console.log("Database ID var: " + databaseID);
        });

};



var uploadImageToCDN = function (req){

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }

        var oldpath = files.userPic.path;

        cloudinary.v2.uploader.upload(oldpath,  {
            public_id: 'profile/display/' + req.body.userID
        }, function(error, result){console.log(result, error)});

        // cloudinary.v2.up

    });
};


module.exports = {
    serverTokenAuth: serverTokenAuth,
    // createUserLogIn: createUserLogIn,
    generateDBID: generateDBID,
    uploadImageToCDN: uploadImageToCDN,
    createWallet: createWallet
    // findProfileWithID: findProfileWithID,
    // retriveAllUserInfo: retriveAllUserInfo,
    // createProfile: createProfile,
    // updateProfile: updateProfile,
    // createTask: createTask
};