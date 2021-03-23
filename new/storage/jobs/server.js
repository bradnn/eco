module.exports = class {
    constructor() {
        this.name = 'Server';
        this.pay = 4500;
        this.workRequirement = 80;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You served Elon Musk food and he tipped generously!",
                "You were given a massive tip!"
            ],
            good: [
                "It was a long day working but you got through it.",
                "You had a decent day and served an average amount."
            ],
            bad: [
                "You failed to serve even one person. How.",
                "You had a complaint that you told off a customer."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}