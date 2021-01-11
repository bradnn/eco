const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'flip'
        this.aliases = ['5050']
    }

    async run (client, msg, args) {
        let user = msg.author;

        var amount = parseInt(args[0]);
        if(!amount || isNaN(amount) || amount < 0) {
            msg.channel.send({embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid amount of money!`,
                color: client.colors.warning
            }});
            return;
        }

        var profile = await ProfileUtils.get(user.id);

        if(amount > profile.econ.wallet.balance) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You don't have enough money for this!`,
                color: client.colors.warning
            }});
            return;
        } else if (amount > 100000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't gamble more than $100,000 at once!`,
                color: client.colors.warning
            }});
            return;
        }

        var chance = Math.random() * 100;

        if (chance > 50) {
            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You flipped heads and got ${FormatUtils.money(amount)}!`,
                color: client.colors.success
            }});

            profile.econ.wallet.balance = profile.econ.wallet.balance + amount;
            await profile.save();
            return;
        } else {
            msg.channel.send({embed: {
                title: `Ouch 🤕`,
                description: `You flipped tails and just lost ${FormatUtils.money(amount)}!`,
                color: client.colors.error
            }});

            profile.econ.wallet.balance = profile.econ.wallet.balance - amount;
            await profile.save();
            return;
        }
    }
}