var mongoose = require("mongoose");

var WalletSchema = new mongoose.Schema({
    balance: {type : Number},
    owner:  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile"
    },
    address: {type : String},
    privateKey: {type : String}

});

module.exports = mongoose.model("Wallet", WalletSchema);