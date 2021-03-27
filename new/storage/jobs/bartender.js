module.exports = class {
    constructor() {
        this.name = 'Bartender';
        this.pay = 3000;
        this.workRequirement = 60;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "Someone got so drunk they tipped extra!",
                "Someone bought a lot of alcohol... A lot..."
            ],
            good: [
                "You sold a lot of drinks today.",
                "Someone bought 10 drinks."
            ],
            bad: [
                "You sold someone too many drinks and the owners aren't happy.",
                "You gave someone alcohol poisoning..."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}