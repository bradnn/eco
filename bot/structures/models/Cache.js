const mongoose = require('mongoose');

const cacheModel = mongoose.Schema({
    userID: {
        type: String,
        default: "776935174222249995"
    },
    baltop: {
        user1: {
            username: {
                type: String
            },
            balance: {
                type: Number,
                default: 0
            }
        },
        user2: {
            username: {
                type: String
            },
            balance: {
                type: Number,
                default: 0
            }
        },
        user3: {
            username: {
                type: String
            },
            balance: {
                type: Number,
                default: 0
            }
        },
        user4: {
            username: {
                type: String
            },
            balance: {
                type: Number,
                default: 0
            }
        },
        user5: {
            username: {
                type: String
            },
            balance: {
                type: Number,
                default: 0
            }
        },
        cacheClearTime: {
            type: Date,
            default: 0
        }
    },
    gemtop: {
        user1: {
            username: {
                type: String
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        user2: {
            username: {
                type: String
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        user3: {
            username: {
                type: String
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        user4: {
            username: {
                type: String
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        user5: {
            username: {
                type: String
            },
            gems: {
                type: Number,
                default: 0
            }
        },
        cacheClearTime: {
            type: Date,
            default: 0
        }
    },
    worktop: {
        user1: {
            username: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        },
        user2: {
            username: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        },
        user3: {
            username: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        },
        user4: {
            username: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        },
        user5: {
            username: {
                type: String
            },
            count: {
                type: Number,
                default: 0
            }
        },
        cacheClearTime: {
            type: Date,
            default: 0
        }
    },
    votetop: {
        user1: {
            username: {
                type: String
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        user2: {
            username: {
                type: String
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        user3: {
            username: {
                type: String
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        user4: {
            username: {
                type: String
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        user5: {
            username: {
                type: String
            },
            votes: {
                type: Number,
                default: 0
            }
        },
        cacheClearTime: {
            type: Date,
            default: 0
        }
    }
});
module.exports = mongoose.model("cacheModel", cacheModel);