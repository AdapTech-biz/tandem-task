var faker = require('faker');
var firebase = require('firebase');
var Profile = require('../models/profile');
var serverMethods = require('../utils/serverMethods');
var dbHelper = require('../utils/dbHelper');

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

var findUsersForTaskCreation = function (profile1, profile2, callback) {
    dbHelper.findUsersForTaskCreation(profile1, profile2, function (creator, acceptor) {
        callback(creator, acceptor);
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


module.exports = {
    generateProfile: generateProfile,
    findUsersForTaskCreation: findUsersForTaskCreation,
    generateTask: generateTask

};