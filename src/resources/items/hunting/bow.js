const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '012',

        this.name = 'bow',
        this.formatName = 'Bow',
        this.emoji = '🏹',

        this.currency = 'coins',
        this.buyPrice = '1500000',
        this.sellPrice = '0',
        this.purchasable = true,

        this.tier = 'uncommon',

        this.category = 'hunting',
        this.categoryName = 'Hunting'
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