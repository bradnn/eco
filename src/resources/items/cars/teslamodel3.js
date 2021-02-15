const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '00F',

        this.name = 'teslaModel3',
        this.formatName = '2021 Tesla Model 3',
        this.emoji = '🚗',

        this.currency = 'coins',
        this.buyPrice = '40000',
        this.sellPrice = '20000',
        this.purchasable = true,

        this.category = 'cars',
        this.categoryName = 'Cars'
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