const userModel = require('../models/User.js');

module.exports.CooldownUtils = {
    set: async function (userID, type, date) {
        let x = await userModel.findOne({ userID: userID }, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        })

        if (!x) {
            x = await userModel.create({
                userID: userID
            });
        }
        
        x.cooldowns[type] = date;
        x.save();
        return;
    }
}