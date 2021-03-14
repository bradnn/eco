const mongoose = require('mongoose');

const globalModel = mongoose.Schema({
    botID: {
        type: String,
        default: "776935174222249995"
    },
    items: {
        lastUsedID: {
            type: Number,
            default: 0
        }
    }
});
module.exports = mongoose.model("globalModel", globalModel);