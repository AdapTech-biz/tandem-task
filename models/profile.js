let mongoose = require("mongoose");

let ProfileSchema = new mongoose.Schema({
    firstName: { type : String , required : true },
    lastName: { type : String , required : true },
    email: {type : String},
    birthDate: {type : Date},
    pictureURL: {type : String},
    createdTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"

    }],
    acceptedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"

    }],
    pendingTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"

    }],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }]

});

module.exports = mongoose.model("Profile", ProfileSchema);