var admin  = require( "firebase-admin");

function voidSessionCookie (req, res, next) {

    var sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
        return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    }).then(() => {
        res.clearCookie('session');
        res.redirect('/');
    }).catch((error) => {
        console.log('error revoking cookie');
        res.redirect('/');
    });
}

module.exports = voidSessionCookie;