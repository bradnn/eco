module.exports = class {
    constructor() {
        this.name = 'Accountant';
        this.pay = 17500;
        this.workRequirement = 2000;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "Your investment tip racked in huge gains for one of your clients, thus they gave you a share of their profits.",
                "The business you helped finance, became so successful, they were pleased with your skills."
            ],
            good: [
                "You successfully opened a bank account for your client.",
                "You compiled the monthly reports for your client."
            ],
            bad: [
                "You caused a business to go into bankruptcy!",
                "You screwed up the report for your client and cause problems with the IRS."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}