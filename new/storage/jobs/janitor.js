module.exports = class {
    constructor() {
        this.name = 'Janitor';
        this.pay = 1500;
        this.workRequirement = 0;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "While mopping the floors you found a wallet!",
                "Someone tipped you for doing a great job!"
            ],
            good: [
                "You did a good job mopping floors.",
                "The bathrooms are clean now thanks to you."
            ],
            bad: [
                "You missed a room, how do you even do that.",
                "You forgot to put up a wet floor sign and someone broke an arm."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}