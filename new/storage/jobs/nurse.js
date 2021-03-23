module.exports = class {
    constructor() {
        this.name = 'Nurse';
        this.pay = 12500;
        this.workRequirement = 900;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You got nurse of the month! You helped the most patients.",
                "Everyone is praising you for your magnificent nursing skills."
            ],
            good: [
                "Your patient was satisfied with your care.",
                "The patient fell better after the treatment."
            ],
            bad: [
                "Your patient passed away due to your lack of skill, maybe attend some more nursing school before you apply again.",
                "While assisting a surgeon, you handed them the wrong tool, causing a malpractice. So you were fired!"
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}