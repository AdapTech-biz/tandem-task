var admin  = require( "firebase-admin");
var serverMethods = require('../utils/serverMethods');

function checkSessionCookie (req, res, next) {

    var sessionCookie = req.cookies.session || '';
    // console.log( sessionCookie);
    // console.log(res.cookie);
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(
        sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
            // console.log(decodedClaims.exp);
            serverMethods.generateDBID(decodedClaims.sub, function (dbID) {
                res.locals.user = dbID;
            });
        next()
    }).catch(error => {
        console.log('Session cookie is unavailable or invalid. Force user to login.');
        res.redirect('/');
    });
}

module.exports = checkSessionCookie;