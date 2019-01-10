var firebase = require('firebase');

function loginMiddleware(req, res, next) {

    var userName = req.body.username;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(userName, password).then( (user) => {
        user.user.getIdToken(true).then(function (token) {

            res.locals.token = token;

            next()
        });
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    });
}

module.exports = loginMiddleware;