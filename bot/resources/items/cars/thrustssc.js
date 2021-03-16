const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '010',

        this.name = 'thrustssc',
        this.formatName = 'ThrustSSC',
        this.emoji = '🏎',

        this.currency = 'gems',
        this.buyPrice = '7500000',
        this.sellPrice = '1000000',
        this.purchasable = true,

        this.tier = 'legendary',

        this.category = 'cars',
        this.categoryName = 'Cars',

        this.maxSpeed = 763
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
        return;
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
        return;
    }

    async get(userID) {
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

        return res.collections[this.category][this.name];
    }
}