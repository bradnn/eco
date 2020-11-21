const userModel = require('../../models/User.js');

module.exports.GemBankUtils = {
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
        return x.econ.bank.gems;
    },
    deposit: async function (userID, amount) {
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

        if (x.econ.wallet.gems >= amount) {
            x.econ.bank.gems += amount;
            x.econ.wallet.gems -= amount;
            x.save();
            return true;
        }

        return false;
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

        x.econ.bank.gems += amount;
        x.save();

        return x.econ.bank.gems;
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

        x.econ.bank.gems -= amount;
        x.save();

        return x.econ.bank.gems;
    }
}