var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    title: { type : String , required : true },
    deadline: {type : Date},
    reward: {type : Number},
    description: {type : String},
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    acceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    taskPhotos: [{
        type: String
    }],
    pending: {type: Boolean}

});

module.exports = mongoose.model("Task", TaskSchema);