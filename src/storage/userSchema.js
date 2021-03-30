const { Schema, model } = require('mongoose');

const user = Schema({
    userID: String,
    profiles: {
        economy: {
            balance: {
                type: Number,
                default: 500
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        level: {
            exp: {
                type: Number,
                default: 0
            }
        },
        storage: {
            inventory: {
                type: Object,
                default: {}
            },
            pets: {
                type: Array,
                default: []
            }
        },
        stats: {
            cooldowns: {
                type: Object,
                default: {
                    work: 0
                }
            },
            work: {
                workCount: {
                    type: Number,
                    default: 0
                },
                job: {
                    type: String,
                    default: 'Janitor'
                },
                sick: {
                    type: Boolean,
                    default: false
                },
                raise: {
                    level: { // Raise Level
                        type: Number,
                        default: 0
                    },
                    count: { // Count til next raise
                        type: Number,
                        default: 0
                    }
                }
            },
            mining: {
                mineCount: {
                    type: Number,
                    default: 0
                }
            }
        }
    }
});

module.exports = model("user", user);