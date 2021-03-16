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
        
        const profile = await ProfileUtils.get(user, client);

        var embed = {
            author: {
                name: `${user.username}'s Profile`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Wallet`,
                    value: `💷 Balance **-** ${FormatUtils.money(profile.getCoins())}
💎 Gems **-** ${FormatUtils.gem(profile.getGems())}`
                },
                {
                    name: `Job`,
                    value: `💼 Current Job **-** ${JobList.formatName[profile.getJob()]}
💷 Raise Level **-** ${profile.getRaise().newRaise}
💎 Pay per Work ${FormatUtils.money(Math.floor(JobList.pay[profile.getJob()] + (JobList.pay[profile.getJob()] * profile.getRaise().newRaise / 10)))} / Work`
                }
            ],
            color: client.colors.default
        }

        embed = TipUtils.embedTip(embed, gPrefix)

        msg.channel.send({embed: embed})
    }
}