const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '004',

        this.name = 'campbellsSoupCan',
        this.formatName = 'Campbells Soup Can',
        this.emoji = '🖼',

        this.currency = 'gems',
        this.buyPrice = '20000',
        this.sellPrice = '10000',
        this.purchasable = true,

        this.category = 'paintings',
        this.categoryName = 'Paintings'
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