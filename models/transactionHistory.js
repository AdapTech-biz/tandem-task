var mongoose = require("mongoose");

var TransactionHistorySchema = new mongoose.Schema({
    address: {type : String},
    history:  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Transaction"
    }]

});

module.exports = mongoose.model("TransactionHistory", TransactionHistorySchema);