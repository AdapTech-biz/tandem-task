var admin  = require( "firebase-admin");

function createSessionCookie (req, res, next){
    //86400 * 1000 * 3  Each day is 86400 seconds
    var  expiresIn = 259200000;
    var options = {maxAge: expiresIn, httpOnly: true, secure: true};
    var idToken;

    if (res.locals.token){  //web based login -- local passed from fireLogIn middleware * may have to change to res.locals*
       idToken = res.locals.token;
    }else idToken = req.body.token; //token sent in body through mobile api call

    admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {
        // var options = {maxAge: expiresIn, httpOnly: true, secure: true};
        // req.session.userCookie = sessionCookie;
        res.cookie('session', sessionCookie, options);
        next();
    });
}

module.exports = createSessionCookie;