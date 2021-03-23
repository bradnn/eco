module.exports = class {
    constructor() {
        this.name = 'Begger';
        this.pay = 250;
        this.workRequirement = 0;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You begged a random guy for money and he happened to be Bill Gates!",
                "You begged a Hedgefund manager for money and he gave in!"
            ],
            good: [
                "You found a person with spare cash.",
                "A person offered you some money."
            ],
            bad: [
                "You asked the wrong person and got arrested.",
                "Someone punched you in the face for annoying them."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}