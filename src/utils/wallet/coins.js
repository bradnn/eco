const userModel = require('../../models/User');

module.exports.CoinUtils = {
    get: async function (userID) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) console.error(err);
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = await userModel.create({
                userID: userID
            });
        };
        return x.econ.wallet.balance;
    },
    add: async function (userID, amount) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) console.error(err);
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = await userModel.create({
                userID: userID
            });
        };

        x.econ.wallet.balance += amount;
        await x.save();

        return x.econ.wallet.balance;
    },
    del: async function (userID, amount) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) console.error(err);
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = await userModel.create({
                userID: userID
            });
        };

        x.econ.wallet.balance -= amount;
        await x.save();

        return x.econ.wallet.balance;
    },
    format: function (x) {
        return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}