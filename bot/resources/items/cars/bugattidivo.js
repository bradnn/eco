const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '00A',

        this.name = 'bugattiDivo',
        this.formatName = 'Bugatti Divo',
        this.emoji = '🚗',

        this.currency = 'coins',
        this.buyPrice = '1400000',
        this.sellPrice = '3250000',
        this.purchasable = true,

        this.tier = 'epic',

        this.category = 'cars',
        this.categoryName = 'Cars',

<<<<<<< Updated upstream
        this.maxSpeed = 236,
        this.crashChance = 1,
        this.repairCost= '540000'
=======
        this.maxSpeed = 240
>>>>>>> Stashed changes
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