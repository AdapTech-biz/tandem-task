var setSessionCookie = function (req, res, next) {

    if (req.session.userCookie) {
        var  expiresIn = 259200000;
        var options = {maxAge: expiresIn, httpOnly: true, secure: true};
        var sessionCookie = req.session.userCookie;
        // console.log(sessionCookie);
        res.cookie('session', sessionCookie, options);
        next();
    }

};
module.exports = setSessionCookie;