const { JobList } = require("../../models/Jobs");
const User = require("../../models/User");
const { UserUtils } = require("../../utils/user");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat");
const { GemUtils } = require("../../utils/wallet/gems");
const { MoneyUtils } = require("../../utils/wallet/money");

module.exports.ProfileHandlers = {
    handler: async function (client, msg, args) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) user = msg.author;

        var profile = await UserUtils.get(user.id);

        var wallet = profile.econ.wallet.balance;
        var gems = profile.econ.wallet.gems;
        
        var embed = {
            author: {
                name: `${user.username}'s Balance`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Wallet`,
                    value: `💷 Coins **-** ${MoneyUtils.format(wallet)}\n💎 Gems **-** ${GemFormatUtils.format(gems)}`
                },
                {
                    name: `Job`,
                    value: `💼 Current Job **-** ${JobList.formatName[profile.work.job]}\n💷 Raise Level **-** ${profile.work.raiseLevel}
💎 Pay per Work ${MoneyUtils.format(Math.floor(JobList.pay[profile.work.job] + (JobList.pay[profile.work.job] * (profile.work.raiseLevel) / 10)))} / Work`
                },
            ]
        }

        msg.channel.createMessage({embed: embed});
    },
    baltop: async function (client, msg, args) {

        User.find({}).sort([['econ.wallet.balance', -1]]).exec(async function(err, docs) {
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `💸 Top Balances:`,
                        icon_url: msg.author.avatarURL
                    },
                    description: `🥇 **#1** <@${docs[0].userID}> 💸 ${MoneyUtils.format(docs[0].econ.wallet.balance)}\n🥈 **#2** <@${docs[1].userID}> 💸 ${MoneyUtils.format(docs[1].econ.wallet.balance)}\n🥉 **#3** <@${docs[2].userID}> 💸 ${MoneyUtils.format(docs[2].econ.wallet.balance)}\n🤮 **#4** <@${docs[3].userID}> 💸 ${MoneyUtils.format(docs[3].econ.wallet.balance)}\n💩 **#5** <@${docs[4].userID}> 💸 ${MoneyUtils.format(docs[4].econ.wallet.balance)}`,
                    color: 6619007
                }
            });
        })
    },
    gemtop: async function (client, msg, args) {

        User.find({}).sort([['econ.wallet.gems', -1]]).exec(async function(err, docs) {
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `💸 Top Gems:`,
                        icon_url: msg.author.avatarURL
                    },
                    description: `🥇 **#1** <@${docs[0].userID}> 💎 ${GemFormatUtils.format(docs[0].econ.wallet.gems)}\n🥈 **#2** <@${docs[1].userID}> 💎 ${GemFormatUtils.format(docs[1].econ.wallet.gems)}\n🥉 **#3** <@${docs[2].userID}> 💎 ${GemFormatUtils.format(docs[2].econ.wallet.gems)}\n🤮 **#4** <@${docs[3].userID}> 💎 ${GemFormatUtils.format(docs[3].econ.wallet.gems)}\n💩 **#5** <@${docs[4].userID}> 💎 ${GemFormatUtils.format(docs[4].econ.wallet.gems)}`,
                    color: 6619007
                }
            });
        })
    },
    worktop: async function (client, msg, args) {

        User.find({}).sort([['stats.work.workCount', -1]]).exec(async function(err, docs) {
            msg.channel.createMessage({
                embed: {
                    author: {
                        name: `💼 Top Workers:`,
                        icon_url: msg.author.avatarURL
                    },
                    description: `🥇 **#1** <@${docs[0].userID}> 💼 ${GemFormatUtils.format(docs[0].stats.work.workCount)}\n🥈 **#2** <@${docs[1].userID}> 💼 ${GemFormatUtils.format(docs[1].stats.work.workCount)}\n🥉 **#3** <@${docs[2].userID}> 💼 ${GemFormatUtils.format(docs[2].stats.work.workCount)}\n🤮 **#4** <@${docs[3].userID}> 💼 ${GemFormatUtils.format(docs[3].stats.work.workCount)}\n💩 **#5** <@${docs[4].userID}> 💼 ${GemFormatUtils.format(docs[4].stats.work.workCount)}`,
                    color: 6619007
                }
            });
        })
    },
}