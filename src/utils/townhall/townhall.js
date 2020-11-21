const townHallModel = require('../../models/TownHall.js');

module.exports.TownHallUtils = {
    get: async function() {
        let x = await townHallModel.findOne({userID: "776935174222249995"}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if (!x) {
            x = townHallModel.create({
                userID: "776935174222249995"
            });
        };
        return x;
    },
    add: async function(amount) {
        let x = await townHallModel.findOne({userID: "776935174222249995"}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if (!x) {
            x = townHallModel.create({
                userID: "776935174222249995"
            });
        };

        x.deposits.total += amount;
        x.save();

        return x.deposits.total;
    },
}