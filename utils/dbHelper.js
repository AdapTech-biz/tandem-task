let Profile = require("../models/profile");
let Wallet  = require( "../models/wallet");
let Task  = require( "../models/task");
let Transaction = require('../models/transaction');
let TransactionHistory  = require( "../models/transactionHistory");
let serverMethods = require('../utils/serverMethods');
let StellarSdk = require('stellar-sdk');

let createProfile = function (requestBody, userID = 0) { //add tokenID back in
    let firstName = requestBody.fName;
    let lastName = requestBody.lName;
    let birthDate = requestBody.birthDate;
    let email = requestBody.email;
    if (userID === 0) { //used for DB seeding
        Profile.create({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            email: email
        }, function (err, newProfile) {
            //Code block used only for testing
            console.log(newProfile);
            Profile.findById("f47e35b6d55dcf6c1fee18bf", function (err, person) {
                // console.log(person);
                person.connections.push(newProfile);
                person.save();
                newProfile.connections.push(person);
                newProfile.save();

                serverMethods.createWallet(newProfile, function (publicKey, secret, walletOwner) {
                    populateWallet(publicKey, secret, walletOwner);
                });
            });

        });
    } else {
        Profile.create({
            _id: userID,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            email: email
        }, function (err, newProfile) {
            console.log(newProfile);
            serverMethods.createWallet(newProfile, function (publicKey, secret, walletOwner) {
                populateWallet(publicKey, secret, walletOwner, function (walletAddres) {
                    TransactionHistory.create({address: walletAddres}, function (err, transactionHistory) {
                        if (err) {console.log(`Creating Transaction History: ${err}`)}
                    })
                });
            });
        });
    }
};

let populateWallet = function (address, pKey, walletOwner, callback) {

    let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    server.loadAccount(address).then(function(account) {

        Wallet.create({
            balance: parseFloat(account.balances[0].balance),
            owner: walletOwner,
            address: address,
            privateKey: pKey
        }, function (err, newWallet) {
            callback(address);
            console.log(newWallet)
        });


    });
};

let findUsersForTaskCreation = function (profile1, profile2, callback) {
    let creator, acceptor;
    Profile.find({ $or: [ { _id: profile1 }, { _id: profile2 } ] }, function (err, profiles) {
        try{

            switch (String(profiles[0]._id)) {
                case profile1:
                    creator = profiles[0];
                    acceptor = profiles[1];
                    break;
                default:
                    acceptor = profiles[0];
                    creator = profiles[1];
            }
            callback(creator, acceptor);
        } catch (err) { console.log(err); }
    });
};

let createTask = function (taskInfo) {
    Task.create(taskInfo, function (err, task) {
        try{
            console.log(task);

            task.creator.createdTasks.push(task);
            task.acceptor.acceptedTasks.push(task);
            task.creator.save();
            task.acceptor.save();
        } catch (err) {
            console.log(err);
        }
    });
};

let compeletTask = function (taskID, callback){
  Task.findById(taskID, function (err, task) {

      try{
          task.pending = false;
          task.save();
          callback(task);
      }catch (err) {
          console.log(err)
      }
  })
};

let createTransactionAndHistory = function (completedTask){

    let transaction = {
        from: completedTask.creator,
        to: completedTask.acceptor,
        date: Date.now(),
        forTask: completedTask
    };
    try{
        // Had to find the wallets of the owner from the completed task to assign transaction history
    Wallet.find({ $or: [ { owner: completedTask.creator }, { owner: completedTask.acceptor } ] }, function (err, walletsArray) {
            Transaction.create(transaction, function (err, newTransaction) { //created new Transaction for completed task
                TransactionHistory.find({ $or: [ { address: walletsArray[0] }, { address: walletsArray[1] } ] }, function (err, historyArray) {
                    historyArray[0].history.push(newTransaction);
                    historyArray[1].history.push(newTransaction);
                    historyArray[0].save();
                    historyArray[1].save();
                });
            });
    });

    }catch (err){
        console.log(err);
    }
};


let updateProfile = function (profileID, updates, callback) {

    let conditions = {
        _id: profileID
    };

    Profile.updateOne(conditions, updates, function (err, updateStatus) {
        if (updateStatus > 0) {
            callback(true);
        }else callback(false);
    });
};

let findProfileWithID = function (dbID, callback) {
    Profile.findById(dbID, function (err, foundProfile) {
        if (err)
            console.log(err);
        callback(foundProfile);
    });
};

let retriveAllUserInfo = function (profileID, callback){
    try{
        Profile.findById(profileID).populate( "connections").populate("acceptedTasks").populate("createdTasks").exec(function (err, foundProfile) {
            if (err)
                console.log(err);
            Wallet.findOne({owner: foundProfile}, function (err, foundWallet) {

                TransactionHistory.find({wallet: foundWallet}, function (err, transactionsArray) {
                    let allInfo = {
                        userProfile: foundProfile,
                        userWallet: foundWallet,
                        userTransactions: transactionsArray
                    };
                    callback(allInfo);
                });
            });
        });


    }catch(err){
        console.log(err)
    }

};

module.exports = {
    findProfileWithID: findProfileWithID,
    retriveAllUserInfo: retriveAllUserInfo,
    populateWallet: populateWallet,
    createProfile: createProfile,
    updateProfile: updateProfile,
    findUsersForTaskCreation: findUsersForTaskCreation,
    createTask: createTask,
    createTransactionAndHistory: createTransactionAndHistory
};