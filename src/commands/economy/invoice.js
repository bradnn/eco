const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'invoice'
        this.aliases = ['requestmoners']
    }

    async run (client, msg, args) {
        var user = msg.author;
        var toUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        var payAmount = parseInt(args[1]);

        if (!toUser || toUser == user) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid user to invoice!`,
                color: client.colors.warning
            }});
            return;
        }

        if (!payAmount || isNaN(payAmount)) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid amount of money!`,
                color: client.colors.warning
            }});
            return;
        }

        var userProfile = await ProfileUtils.get(user.id);
        var toUserProfile = await ProfileUtils.get(toUser.id);

        if (payAmount > toUserProfile.econ.wallet.balance) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `They don't have enough money for this!`,
                color: client.colors.warning
            }});
            return;
        } else if (payAmount > 500000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't invoice more than $500,000 each hour!`,
                color: client.colors.warning
            }});
            return;
        }

        const cooldown = await CooldownHandlers.get("pay", toUser, false);
        if (cooldown.response) {
            msg.channel.send(cooldown.embed);
            return;
        }

        msg.channel.send({ embed: {
            title: `Be Careful ${toUser.username} ⚠`,
            description: `You can only pay someone once an hour! Are you sure you want to pay ${user.username} ${payAmount}?\nType \`yes\` to proceed.`,
            color: client.colors.warning
        }});

        const filter = m => m.content.toLowerCase().includes('yes') && m.author.id == toUser.id;
        const collector = msg.channel.createMessageCollector(filter, { max: 1, time: 30000});

        collector.on('collect', async m => {
            const cooldown = await CooldownHandlers.get("pay", toUser);
            toUserProfile.econ.wallet.balance -= payAmount;
            userProfile.econ.wallet.balance += payAmount;
            await toUserProfile.save();
            userProfile.save();

            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You just sent ${FormatUtils.money(payAmount)} to ${user.username}!`,
                color: client.colors.success
            }})
            return;
        });

    }
}