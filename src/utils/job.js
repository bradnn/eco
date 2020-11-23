const { JobList } = require('../models/Jobs.js');
const userModel = require('../models/User.js');

module.exports.JobUtils = {
    get: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        return x.work.job;
    },
    set: async function (userID, type) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };

        var jobs = Object.keys(JobList.pay);
        if(jobs.includes(type)) {
            x.work.job = type;
            x.work.raiseLevel = 0;
            x.stats.work.workCountRaise = 0;
            x.save();
        }

        return x.work.job;
    },
    getRaise: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        return x.work.raiseLevel;
    },
    addRaise: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        x.work.raiseLevel += 1;
        x.stats.work.workCountRaise = 0;
        await x.save();
        return x.work.raiseLevel;
    },
    addCount: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        
        x.stats.work.workCount += 1;
        x.stats.work.workCountRaise += 1;
        x.save();

        return x.stats.work.workCount;
    },
    sick: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        if(x.work.sick = true) {
            x.work.sick = false;
        } else {
            x.work.sick = true;
        }
        await x.save();
        return x.work.sick;
    }
}