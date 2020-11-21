const { UserUtils } = require("../../utils/user");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat");
const { MoneyUtils } = require("../../utils/wallet/money");

module.exports.StatHandlers = {
    handler: async function (client, msg, args) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) user = msg.author;

        var profile = await UserUtils.get(user.id);

        var embed = {
            author: {
                name: `${user.username}'s Balance`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Work Stats`,
                    value: `🔧 Times Worked **-** ${profile.stats.work.workCount}\n🌎 Times Worked (Since last raise) **-** ${profile.stats.work.workCountRaise}/25`
                },
                {
                    name: `Town Hall`,
                    value: `💷 Coins Deposited **-** ${profile.stats.townhall.depositAmount}`
                }
            ]
        }

        msg.channel.createMessage({embed: embed});
    }
}