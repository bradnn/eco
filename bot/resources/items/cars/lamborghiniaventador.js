const userModel = require('../../../structures/models/User.js');

module.exports = class {
    constructor() {
        this.id = '00C',

        this.name = 'lamborghiniAventador',
        this.formatName = '2020 Lamborghini Aventador',
        this.emoji = '🚗',

        this.currency = 'coins',
        this.buyPrice = '1000000',
        this.sellPrice = '325000',
        this.purchasable = true,

        this.tier = 'rare',

        this.category = 'cars',
        this.categoryName = 'Cars',

<<<<<<< Updated upstream
        this.maxSpeed = 220,
        this.crashChance = 5,
        this.repairCost= '40000'
=======
        this.maxSpeed = 230
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