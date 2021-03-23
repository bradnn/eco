module.exports = class {
    constructor() {
        this.name = 'Cashier';
        this.pay = 2000;
        this.workRequirement = 15;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "Someone tipped you their extra cash!",
                "You worked overtime and got paid!"
            ],
            good: [
                "You had a good day working and got paid.",
                "You sold a lot of cheese puffs today..."
            ],
            bad: [
                "You only sold to 1 person... Thats it??",
                "Someone complained you threw their food on the ground."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}