var mongoose = require("mongoose");

var TransactionSchema = new mongoose.Schema({
    from: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile"
    },
    to:  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile"
    },
    transactionDate: {type : Number},
    forTask:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task"
    }

});

module.exports = mongoose.model("Transaction", TransactionSchema);