module.exports = class {
    constructor() {
        this.name = 'Mechanic';
        this.pay = 9000;
        this.workRequirement = 500;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You did a excellent job! The car you repaired looks brand new.",
                "You repaired the car engine, there were no drawbacks."
            ],
            good: [
                "You successfully repaired a car.",
                "The customer was satisfied with your mediocre service."
            ],
            bad: [
                "You did a horrible job. You're not even trusted to fix a bicycle.",
                "You left your wrench in the car engine, causing an accident."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}