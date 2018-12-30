let formidable = require( "formidable");
let admin  = require( "firebase-admin");
let firebase  = require( "firebase");
let StellarSdk  = require( "stellar-sdk");
let cloudinary = require('cloudinary');

// let createUserLogIn = function (requestBody, callback) {
//
//     // console.log(requestBody);
//
//
//     firebase.auth().createUserWithEmailAndPassword(requestBody.email, requestBody.password).then(function (createdUser) {
//         let userID = generateDBID(createdUser.user.uid);
//         let actionCodeSettings = {
//             url: 'https://www.pinup-ac1d5.firebaseapp.com/?email=' + createdUser.email,
//             iOS: {
//                 bundleId: 'com.xyd93.PinUp'
//             },
//             handleCodeInApp: true
//         };
//         createdUser.user.sendEmailVerification(actionCodeSettings).then(function (value) {
//             console.log("Email sent");
//             console.log(value)
//         }).catch(function (reason) {
//             console.log(reason);
//         });
//         // return (createdUser.user.uid);
//         callback(requestBody, userID);
//     })
//         .catch(function (reason) {
//             console.log(reason)
//         })
// };

/** Database helper models
 *
 *  Unique 12-bit ID hex creation */

let generateDBID = function (identifier, callback) {
    console.log("generateDBID--Firebase UID: " + identifier);
    let generatedHash = require('crypto')
        .createHash('sha256')
        .update(identifier, 'utf8')
        .digest('hex');
    // console.log("generatedHash string " + generatedHash.substring(0, 24));
    callback(generatedHash.substring(0, 24));
    // return (generatedHash.substring(0, 24));
};



let createWallet = function (walletOwner, callback) {

    let pair = StellarSdk.Keypair.random();
    let publicKey = pair.publicKey(); //generates public and private key pair for lumen wallet
    let secret = pair.secret();


    // generates a wallet balance  = require( Stellar test network
    let request = require('request');
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
let serverTokenAuth = function (idToken, callback) {
    admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            // console.log("serverTokenAuth--firebaseUID: " + decodedToken.uid);
            callback(decodedToken.uid);
            // console.log("Database ID let: " + databaseID);
        });

};



let uploadImageToCDN = function (req){

    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }

        let oldpath = files.userPic.path;

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