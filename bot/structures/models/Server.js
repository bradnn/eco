const mongoose = require('mongoose');

const serverModel = mongoose.Schema({
    serverID: String,
    config: {
        prefix: {
            type: String,
            default: ";"
        }
    },
    auctions: {
        first: {
            auction: {
                item: {
                    type: String,
                    default: "monalisa"
                },
                amount: {
                    type: Number,
                    default: 1
                },
                startingBid: {
                    type: Number,
                    default: 100000
                },
                bidType: {
                    type: String,
                    default: "Gems"
                },
                increment: {
                    type: Number,
                    default: 150
                },
                curBid: {
                    type: Number,
                    default: 0
                },
                endTime: {
                    type: Date,
                    default: 0
                }
            },
            lastBidder: {
                userID: {
                    type: String,
                    default: "No bidder"
                },
                amount: {
                    type: Number,
                    default: 0
                }
            }
        },
        second: {
            auction: {
                item: {
                    type: String,
                    default: "monalisa"
                },
                amount: {
                    type: Number,
                    default: 1
                },
                startingBid: {
                    type: Number,
                    default: 100000
                },
                bidType: {
                    type: String,
                    default: "Gems"
                },
                increment: {
                    type: Number,
                    default: 150
                },
                curBid: {
                    type: Number,
                    default: 0
                },
                endTime: {
                    type: Date,
                    default: 0
                }
            },
            lastBidder: {
                userID: {
                    type: String,
                    default: "No bidder"
                },
                amount: {
                    type: Number,
                    default: 0
                }
            }
        }
    }
});
module.exports = mongoose.model("serverModel", serverModel);