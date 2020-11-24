const { JobList } = require("../../models/Jobs");
const { UserUtils } = require("../../utils/user");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat");
const { MoneyUtils } = require("../../utils/wallet/money");

module.exports.StatHandlers = {
    handler: async function (client, msg, args) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) user = msg.author;

        var profile = await UserUtils.get(user.id);
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
            ]
        }

        msg.channel.createMessage({embed: embed});
    }
}