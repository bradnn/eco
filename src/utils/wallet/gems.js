const userModel = require('../../models/User.js');

module.exports.GemUtils = {
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
        return x.econ.wallet.gems;
    },
    add: async function (userID, amount) {
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

        x.econ.wallet.gems += amount;
        await x.save();

        return x.econ.wallet.gems;
    },
    del: async function (userID, amount) {
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

        x.econ.wallet.gems -= amount;
        await x.save();

        return x.econ.wallet.gems;
    }
}