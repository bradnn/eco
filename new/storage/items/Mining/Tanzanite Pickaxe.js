module.exports = class {
    constructor() {
        this.id = '00b';

        this.name = 'Tanzanite Pickaxe';
        this.emoji = '⛏️';

        this.purchasable = true;
        this.sellable = false;
        this.currency = 'gems';

        this.buyPrice = 75000;
        this.sellPrice = 0;

        this.tier = 'rare';
        this.category = 'Mining';

        this.priority = 999;

        this.craftingReq = {
            '00a': 1000,
            '008': 250,
            '006': 4
        }
    }
}