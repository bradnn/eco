const { UserUtils } = require("../../utils/user");
const { CoinUtils } = require("../../utils/wallet/coins");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat");
const { MoneyUtils } = require("../../utils/wallet/money");

module.exports.GambleHandler = {
    handler: async function (client, msg, args, gambleType) {
        var user = msg.author;
        var profile = await UserUtils.get(user.id);

        var theirBalance = profile.econ.wallet.balance;
        
        var gambleAmount = parseInt(args[0]);

        if(!gambleAmount || isNaN(gambleAmount)) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please supply a valid amount of money!`,
                    color: 16729344
                }
            });
            return;
        } else if (gambleAmount > theirBalance) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You don't have enough money for this!`,
                    color: 16729344
                }
            });
            return;
        } else if (gambleAmount > 100000) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You can't gamble more than $100,000 at once!`,
                    color: 16729344
                }
            });
            return;
        }

        switch(gambleType) {
            case "flip":
                this.flip(client, msg, args, gambleAmount);
                return;
        }
    },
    flip: async function (client, msg, args, gambleAmount) {
        var user = msg.author;
        await CoinUtils.del(user.id, gambleAmount);

        var chance = Math.floor(Math.random() * 100);
        if (chance > 50) {
            await CoinUtils.add(user.id, (gambleAmount * 2));
            msg.channel.createMessage({
                embed: {
                    title: `Congrats!`,
                    description: `You just earned ${MoneyUtils.format(gambleAmount)}!`,
                    color: 65280
                }
            });
            return;
        } else {
            msg.channel.createMessage({
                embed: {
                    title: `Ouch...`,
                    description: `You just lost ${MoneyUtils.format(gambleAmount)}!`,
                    color: 16729344
                }
            });
            return;
        }
    }
}