const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '009',

        this.name = 'newYears2021Ball',
        this.formatName = '2021 New Years Ball',
        this.emoji = '🎊',

        this.currency = 'coins',
        this.buyPrice = '0',
        this.sellPrice = '0',
        this.purchasable = false,

        this.category = 'seasonal',
        this.categoryName = 'Seasonal'
    }

    async add(userID, amount) {
        let res = await userModel.findOne({userID: userID}, async function (err, res) {
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

        res.collections[this.category][this.name] += amount;
        res.save();
    }

    async remove(userID, amount) {
        let res = await userModel.findOne({userID: userID}, async function (err, res) {
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

        res.collections[this.category][this.name] -= amount;
        res.save();
    }
}