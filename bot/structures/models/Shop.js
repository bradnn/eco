const mongoose = require('mongoose');

const shopModel = mongoose.Schema({
    userID: {
        type: String,
        default: "776935174222249995"
    },
    superSale: {
        item1: {
            type: String,
            default: "monalisa"
        },
        item2: {
            type: String,
            default: "rollsRoyceSweptail"
        },
        resetTime: {
            type: Date,
            default: 0
        }
    },
    shopFeatured: {
        item1: {
            type: String,
            default: "scream"
        },
        item2: {
            type: String,
            default: "mcLarenP1"
        },
        item3: {
            type: String,
            default: "teslaModelX"
        },
        resetTime: {
            type: Date,
            default: 0
        }
    }
});
module.exports = mongoose.model("shopModel", shopModel);