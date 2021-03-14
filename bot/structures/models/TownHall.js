const mongoose = require('mongoose');

const townHallModel = mongoose.Schema({
    userID: {
        type: String,
        default: "776935174222249995"
    },
    deposits: {
        total: {
            type: Number,
            default: 0
        }
    }
});
module.exports = mongoose.model("townHallModel", townHallModel);