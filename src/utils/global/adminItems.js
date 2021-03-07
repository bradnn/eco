const globalModel = require('../../structures/models/Global.js');

module.exports.itemUtilsAdmin = {
    getLastUsedID: async function () {
        let res = await globalModel.findOne ({userID: "776935174222249995"}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = await globalModel.create({
                userID: userID
            });
        }
        return res;
    }
}