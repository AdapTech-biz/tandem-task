let faker = require('faker');
let firebase = require('firebase');
let Profile = require('../models/profile');
let serverMethods = require('../utils/serverMethods');
let dbHelper = require('../utils/dbHelper');

let generateProfile = function () {

    let fakeUserInfomation = {
        fName: faker.name.firstName(),
        lName: faker.name.lastName(),
        email: faker.internet.email(),
        birthDate: faker.date.past(),
        pictureURL: faker.image.imageUrl(),

    };

    dbHelper.createProfile(fakeUserInfomation);

};

let findUsersForTaskCreation = function (profile1, profile2, callback) {
    dbHelper.findUsersForTaskCreation(profile1, profile2, function (creator, acceptor) {
        callback(creator, acceptor);
    })
};

let generateTask = function(creator, acceptor) {

    let task = {
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