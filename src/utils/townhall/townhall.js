const townHallModel = require('../../structures/models/TownHall.js');

module.exports.townHallUtils = {
    get: async function() {
        let res = await townHallModel.findOne({userID: "776935174222249995"}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = townHallModel.create({
                userID: "776935174222249995"
            });
        }
        return res;
    }
}