const { JobList } = require("../../structures/models/Jobs");
const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'stats'
        this.aliases = ['mystats', 'progress']
    }

    async run (client, msg, args, gPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        var profile = await ProfileUtils.get(user.id);
        const jobList = Object.keys(JobList.pay);
        var jobIndex = jobList.indexOf(profile.work.job);
        var job = jobList[jobIndex + 1];
        var nextReq = JobList.workReq[job];
        var reqMessage = ``;

        if(nextReq == undefined) {
            reqMessage = `MAX JOB`;
        } else {
            reqMessage = `${nextReq} needed`
        }

        var embed = {
            author: {
                name: `${user.username}'s Stats`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Work Stats`,
                    value: `🔧 Times Worked **-** ${profile.stats.work.workCount} (${reqMessage})\n🌎 Times Worked (Since last raise) **-** ${profile.stats.work.workCountRaise}/25`
                },
                {
                    name: `Town Hall`,
                    value: `💷 Coins Deposited **-** ${profile.stats.townhall.depositAmount}`
                }
            ],
            color: client.colors.default
        }

        embed = TipUtils.embedTip(embed, gPrefix);

        msg.channel.send({embed: embed});
    }
}