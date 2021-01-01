const userModel = require('../../structures/models/User.js');

module.exports.ProfileUtils = {
    get: async function (userID) {
        let res = await userModel.findOne ({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = await userModel.create({
                userID: userID
            });
        }
        return res;
    }
}