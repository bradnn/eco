const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'pay'
        this.aliases = ['send']
    }

    async run (client, msg, args) {
        var user = msg.author;
        var toUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

        var payAmount = parseInt(args[1]);

        if (!toUser || toUser == user) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid user to pay!`,
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

        if (payAmount > userProfile.econ.wallet.balance) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You don't have enough money for this!`,
                color: client.colors.warning
            }});
            return;
        } else if (payAmount > 500000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't pay more than $500,000 each hour!`,
                color: client.colors.warning
            }});
            return;
        }

        const cooldown = await CooldownHandlers.get("pay", user, false);
        if (cooldown.response) {
            msg.channel.send(cooldown.embed);
            return;
        }

        msg.channel.send({ embed: {
            title: `Be Careful ⚠`,
            description: `You can only pay someone once an hour! Are you sure you want to pay?\nType \`yes\` to proceed.`,
            color: client.colors.warning
        }});

        const filter = m => m.content.toLowerCase().includes('yes') && m.author.id == user.id;
        const collector = msg.channel.createMessageCollector(filter, { max: 1, time: 30000});

        collector.on('collect', async m => {
            const cooldown = await CooldownHandlers.get("pay", user);
            userProfile.econ.wallet.balance -= payAmount;
            toUserProfile.econ.wallet.balance += payAmount;
            await userProfile.save();
            toUserProfile.save();

            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You just sent ${FormatUtils.money(payAmount)} to ${toUser.username}!`,
                color: client.colors.success
            }})
            return;
        });

    }
}