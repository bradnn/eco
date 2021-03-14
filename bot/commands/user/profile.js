const { JobList } = require("../../structures/models/Jobs");
const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'profile'
        this.aliases = ['balance', 'bal', 'user']
    }

    async run (client, msg, args, gPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        function getNet(profile) {
            var worths = {
                gemWorth: profile.econ.wallet.gems * 1000,
                coinWorth: profile.econ.wallet.balance,
                otherWorth: 100
            }

            var net = 0;

            var job;

            for (job in worths) {
                net += parseInt(worths[job]);
            }

            return net;
        }
        

        var profile = await ProfileUtils.get(user.id);

        getNet(profile);

        var embed = {
            author: {
                name: `${user.username}'s Profile`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Wallet`,
                    value: `💷 Balance **-** ${FormatUtils.money(profile.econ.wallet.balance)}
💎 Gems **-** ${FormatUtils.gem(profile.econ.wallet.gems)}`
                },
                {
                    name: `Job`,
                    value: `💼 Current Job **-** ${JobList.formatName[profile.work.job]}
💷 Raise Level **-** ${profile.work.raiseLevel}
💎 Pay per Work ${FormatUtils.money(Math.floor(JobList.pay[profile.work.job] + (JobList.pay[profile.work.job] * profile.work.raiseLevel / 10)))} / Work`
                }
            ],
            color: client.colors.default
        }

        embed = TipUtils.embedTip(embed, gPrefix)

        msg.channel.send({embed: embed})
    }
}