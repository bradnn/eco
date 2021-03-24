module.exports = class {
    constructor() {
        this.name = 'Assistant';
        this.pay = 6000;
        this.workRequirement = 170;
    }

    getMessage(type = "good") {
        const messages = {
            perfect: [
                "You worked for Bill Gates today and he gave you a giant tip1",
                "You worked very hard today and were given a bonus!"
            ],
            good: [
                "You worked as an assistant for a law firm.",
                "You filed taxes all day."
            ],
            bad: [
                "You couldnt find any work.",
                "You're literally useless. How did you not find a single job."
            ]
        }

        return messages[type][Math.floor(Math.random() * messages[type].length)];
    }
}