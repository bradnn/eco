const { DarkNetItems } = require("../../models/DarkNetMarket");
const userModel = require("../../models/User");

module.exports.DarkItems = {
    add: async function (userID, item, amount) {
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

        let types = DarkNetItems.type;
        var type = types[item];

        x.crime.darknet[type][item] += amount;
        x.save();

        return x;
    }
}