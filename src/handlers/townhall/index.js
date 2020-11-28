const { TownHallUtils } = require("../../utils/townhall/townhall.js");
const { UserUtils } = require("../../utils/user");
const { CoinBankUtils } = require("../../utils/wallet/bankCoins");
const { CoinUtils } = require("../../utils/wallet/coins");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat");
const { MoneyUtils } = require("../../utils/wallet/money");

module.exports.TownHallHandlers = {
    handler: async function (client, msg, args, guildPrefix) {
        var subCommand = args[0];

        if(!subCommand) {
            this.info(client, msg, args, guildPrefix);
            return;
        }
        switch(subCommand) {
            case "deposit":
                this.deposit(client, msg, args, guildPrefix);
                break;
            case "unlocks":
                this.unlocks(client, msg, args, guildPrefix);
                break;
            default:
                this.info(client, msg, args, guildPrefix);
                break;
        }
    },
    info: async function (client, msg, args, guildPrefix) {
        var townInfo = await TownHallUtils.get();

        var embed = {
            author: {
                name: `🔔 Town Hall`,
                icon_url: client.bot.avatarURL
            },
            fields: [
                {
                    name: `Total Deposits`,
                    value: `💷 Coins **-** ${MoneyUtils.format(townInfo.deposits.total)}`
                }
            ],
            footer: {
                text: `Do ${guildPrefix}townhall deposit <amount> to contribute!`
            }
        }

        msg.channel.createMessage({embed: embed});
    },
    unlocks: async function (client, msg, args, guildPrefix) {
        var townInfo = await TownHallUtils.get();

        var embed = {
            author: {
                name: `🔔 Town Hall`,
                icon_url: client.bot.avatarURL
            },
            fields: [
                {
                    name: `Deposit Unlocks`,
                    value: `$1M **-** Unlock Auction House
$2.5M **-** Unlocks Crimes
$10M **-** Unlocks DarkNet`
                }
            ],
            footer: {
                text: `Do ${guildPrefix}townhall deposit <amount> to contribute!`
            }
        }

        msg.channel.createMessage({embed: embed});
    },
    deposit: async function (client, msg, args) {
        var profile = await UserUtils.get(msg.author.id);

        var amount = parseInt(args[1]);

        if(isNaN(amount) || !amount) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `Please provid a valid number!`,
                    color: 16729344
                }
            });
            return;
        } else if (amount > profile.econ.wallet.balance || amount <= 0 || profile.econ.wallet.balance == 0) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You don't have enough to deposit!`,
                    color: 16729344
                }
            });
            return;
        }
        
        TownHallUtils.add(amount);
        await CoinUtils.del(msg.author.id, amount);
        UserUtils.addTownDeposit(msg.author.id, amount);

        msg.channel.createMessage({
            embed: {
                title: `Transfer Complete!`,
                description: `You just deposited ${amount} to the town hall bank!`,
                color: 65280
            }
        });
        return;
    }
}