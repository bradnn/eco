const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'jobs',
        this.aliases = ['listjobs']
    }

    async run(client, msg, args, guildPrefix) {

        let jobs = Object.keys(JobList.workReq);
        var embed = {
            title: `Current Jobs 👷‍♂️`
        };

        var currentJobs = `__Job Name **-** Payrate (Work Requirement)__\n\n`;
        var job;
        for (job in jobs) {
            if (jobs[job] == "None" || jobs[job] == "begger") {
                continue;
            }
            currentJobs += `${JobList.formatName[jobs[job]]} **-** ${FormatUtils.money(JobList.pay[jobs[job]])} per work (${FormatUtils.numberComma(JobList.workReq[jobs[job]])} times)\n`;
        }
        embed.description = currentJobs;

        msg.channel.send({ embed: embed});
        return;
    }
}