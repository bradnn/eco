module.exports = class {
    constructor() {
        this.id = '005';

        this.name = 'Pickaxe';
        this.emoji = '⛏️';

        this.purchasable = true;
        this.sellable = false;
        this.currency = 'coins';

        this.buyPrice = 75000;
        this.sellPrice = 0;

        this.tier = 'common';
        this.category = 'Mining';
    }
}