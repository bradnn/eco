const userModel = require('../models/User.js');

module.exports.CrimeUtils = {
    levelup: async function (userID, type) {
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

        x.crime.skills[type] += 1;
        x.save();

        return x;
    },
}