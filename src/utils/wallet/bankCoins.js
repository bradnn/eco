const userModel = require('../../models/User.js');

module.exports.CoinBankUtils = {
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
        return x.econ.bank.balance;
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

        if (x.econ.wallet.balance >= amount) {
            x.econ.bank.balance += amount;
            x.econ.wallet.balance -= amount;
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

        x.econ.bank.balance += amount;
        x.save();

        return x.econ.bank.balance;
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

        x.econ.bank.balance -= amount;
        x.save();

        return x.econ.bank.balance;
    }
}