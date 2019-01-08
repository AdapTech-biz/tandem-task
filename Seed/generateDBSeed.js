var faker = require('faker');
var firebase = require('firebase');
var Profile = require('../models/profile');
var serverMethods = require('../utils/serverMethods');
var dbHelper = require('../utils/dbHelper');

var runSeed = function () {
  //Paste in seed code needed to run
};

var generateProfile = function () {

    var fakeUserInfomation = {
        fName: faker.name.firstName(),
        lName: faker.name.lastName(),
        email: faker.internet.email(),
        birthDate: faker.date.past(),
        pictureURL: faker.image.imageUrl(),

    };

    dbHelper.createProfile(fakeUserInfomation);

};

var findUsersForTaskCreation = function (profile1, profile2) {
    dbHelper.findUsersForTaskCreation(profile1, profile2, function (creator, acceptor) {
        generateTask(creator, acceptor);
    })
};

var generateTask = function(creator, acceptor) {

    var task = {
        title: faker.name.title(),
        deadline: faker.date.future(),
        reward: faker.finance.amount(),
        description: faker.lorem.paragraph(),
        creator: creator,
        acceptor: acceptor,
        taskPhotos: [faker.image.imageUrl(),
                    faker.image.imageUrl(),
                    faker.image.imageUrl(),
                    faker.image.imageUrl()]
    };
        dbHelper.createTask(task);
};

var completeTask = function(taskID){
  dbHelper.compeleteTask(taskID);
};

/************Clears data from DB********************/
// var Profile = require("./models/profile");
// var TransactionHistory = require('./models/transactionHistory');
// var Wallet = require("./models/wallet");
// var Task = require("./models/task");
//  Profile.remove({}, function(err){
//       if(err){
//           console.log(err);
//       }
//       console.log("Profile db cleared");
//  });
//  Wallet.deleteMany({ owner : { $ne: "f47e35b6d55dcf6c1fee18bf" } }, function(err){
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


module.exports = {
    runSeed:runSeed
};