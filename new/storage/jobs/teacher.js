module.exports = class {
    constructor() {
        this.name = 'Teacher';
        this.pay = 7500;
        this.workRequirement = 290;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You did an amazing job at teaching, your class performed the best in the whole school.",
                "You were awarded teacher of the month, thus giving you a bonus!"
            ],
            good: [
                "You successfully taught your class.",
                "Good Job! Your students are meeting the school expectations."
            ],
            bad: [
                "You made a student cry, their parent is suing you.",
                "Your entire class managed to fail their finals, so you were fired!"
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}