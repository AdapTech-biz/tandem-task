
var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require("method-override");
var admin = require('firebase-admin');
var serviceAccount = require('./pinup-ac1d5-firebase-adminsdk-ocohu-e80e97c58c.json');
var seed = require('./Seed/generateDBSeed');

var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profiles');
var usersRouter = require('./routes/users');

var app = express();


/************Clears data from DB********************/
var Profile = require("./models/profile");
// var Wallet = require("./models/wallet");
// var Task = require("./models/task");
//  Profile.remove({}, function(err){
//       if(err){
//           console.log(err);
//       }
//       console.log("Profile db cleared");
//  });
//  Wallet.remove({}, function(err){
//       if(err){
//           console.log(err);
//       }
//       console.log("Wallet db cleared");
//  });
//  Task.remove({}, function(err){
//       if(err){
//           console.log(err);
//       }
//       console.log("Task db cleared");
//  });
/****************End of Clearing DB****************/

/** Generate fake user profiles for testing/dev */
// seed.generateProfile();

/** Remove all profiles EXCEPT for Xavier's */
// Profile.deleteMany({ firstName : { $ne: "Xavier" } }, function (err, result) {
//     try{
//         console.log(result)
//     }catch (err) {
//         console.log(err)
//     }
// } );

// Profile.find({_id: 'f47e35b6d55dcf6c1fee18bf'}, function (err, person) {
//     try{
//         console.log(person);
//     } catch (err) {
//         console.log(err)
//     }
// });

// seed.findUsersForTaskCreation( 'f47e35b6d55dcf6c1fee18bf', '5c1ae39bc1377c2a20902dbd', function (creator, acceptor) {
//     seed.generateTask(creator, acceptor);
// });






admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pinup-ac1d5.firebaseio.com"
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://group:cmsc495_Group2@cmcs495-a596k.mongodb.net/', { dbName: 'tandem_task', useNewUrlParser: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use('/', indexRouter);
app.use('/profiles', profileRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
