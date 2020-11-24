const { UserUtils } = require("../../utils/user");
const { CoinUtils } = require("../../utils/wallet/coins");
const { MoneyUtils } = require("../../utils/wallet/money");
const { CooldownHandlers } = require("../cooldown");

module.exports.PayHandler = {
    handler: async function (client, msg, args) {
        var user = msg.author;
        var toUser = msg.mentions[0] || client.users.get(args[0]);
        var profile = await UserUtils.get(user.id);

        var theirBalance = profile.econ.wallet.balance;
        
        var payAmount = parseInt(args[1]);

        if(!toUser || toUser == user) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please supply a valid user to pay!`,
                    color: 16729344
                }
            });
            return;
        }

        if(!payAmount || isNaN(payAmount)) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please supply a valid amount of money!`,
                    color: 16729344
                }
            });
            return;
        } else if (payAmount > theirBalance) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You don't have enough money for this!`,
                    color: 16729344
                }
            });
            return;
        } else if (payAmount > 100000) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You can't pay more than $100,000 every hour!`,
                    color: 16729344
                }
            });
            return;
        }

        msg.channel.createMessage({embed: {
                    title: `Be careful!`,
                    description: `You can only pay someone once an hour! Are you sure you want to pay?\nType \`yes\` to proceed.`,
                    color: 16729344
                }
        });

        let responses = await msg.channel.awaitMessages(m => m.author.id == msg.author.id && m.content == "yes", { time: 30000, maxMatches: 1});
        
        if (responses.length) {
            const cooldown = await CooldownHandlers.get("pay", msg.author);
            if (cooldown.response) {
                msg.channel.createMessage(cooldown.embed);
                return;
            }
            await CoinUtils.del(user.id, payAmount);
            CoinUtils.add(toUser.id, payAmount);
            msg.channel.createMessage({
                embed: {
                    title: `Congrats!`,
                    description: `You just sent ${MoneyUtils.format(payAmount)} to ${toUser.username}!`,
                    color: 65280
                }
            });
            return;
        } else {
            return;
        }
    }
}