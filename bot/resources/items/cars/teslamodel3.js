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

        this.tier = 'uncommon',

        this.category = 'cars',
        this.categoryName = 'Cars',

<<<<<<< Updated upstream
        this.maxSpeed = 140,
        this.crashChance = 25,
        this.repairCost= '4000'
=======
        this.maxSpeed = 120
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