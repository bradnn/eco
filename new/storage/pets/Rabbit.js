module.exports = class {
    constructor() {
        this.name = 'Rabbit';
        this.emoji = '🐇';
        
        this.boostType = 'workAmount';
        this.boostAmount = {
            'common': 0.1,
            'uncommon': 0.3,
            'rare': 0.65,
            'epic': 1.0,
            'legendary': 1.5
        }
    }
}