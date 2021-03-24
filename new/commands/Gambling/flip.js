const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'flip',
        this.aliases = ['5050']
        this.unlockLevel = 15;
    }

    async run(client, msg, args, options) {
        const user = options.author;
        const amount = parseInt(args[0]);
        if (!amount || isNaN(amount) || amount < 0) {
            msg.channel.send({embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid amount of money!`,
                color: client.colors.warning
            }});
            return;
        }
        if (user.getCoins() < amount) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You don't have enough money for this!`,
                color: client.colors.warning
            }});
            return;
        } else if (amount > 500000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't gamble more than $500,000 at once!`,
                color: client.colors.warning
            }});
            return;
        }

        var chance = Math.random() * 100;
        if (chance > 50) {
            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You flipped heads and got ${Number.money(amount)}!`,
                color: client.colors.success
            }});

            user.addCoins(amount);
            user.save();
            return;
        } else {
            msg.channel.send({embed: {
                title: `Ouch 🤕`,
                description: `You flipped tails and just lost ${Number.money(amount)}!`,
                color: client.colors.error
            }});

            user.delCoins(amount) ;
            user.save();
            return;
        }
    }
}