const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'apply',
        this.aliases = ['applyfor']
    }

    async run(client, msg, args, guildPrefix) {
        var user = msg.author;
        var profile = await ProfileUtils.get(user, client);
        let jobs = Object.keys(JobList.workReq);

        if (!args[0]) {
            var embed = {
                title: `Available Jobs 👷‍♂️`
            };

            var availableJobs = ``;
            var job;
            for (job in jobs) {
                if (JobList.workReq[jobs[job]] <= profile.stats.work.workCount) {
                    if (jobs[job] != "None" && jobs[job] != "begger") {
                        if (profile.work.job != jobs[job]) {
                            availableJobs += `${JobList.formatName[jobs[job]]} **-** ${FormatUtils.money(JobList.pay[jobs[job]])} per work\n`
                        }
                    }
                }
            }

            if (availableJobs == ``) {
                availableJobs = `There are no jobs available for you! Work some more to meet the requirements for new jobs.`
                embed.color = client.colors.warning
            } else {
                embed.color = client.colors.default
            }

            embed.description = availableJobs;

            msg.channel.send({ embed: embed});
            return;
        } else {
            var applyingFor;
            if (!args[1]) {
                applyingFor = args[0].toLowerCase();
            } else {
                applyingFor = args[0].toLowerCase() + args[1].toLowerCase();
            }

            if(jobs.includes(applyingFor)) {
                var requirement = JobList.workReq[applyingFor];
                if (profile.stats.work.workCount >= requirement) {

                    if (profile.work.job == applyingFor) {
                        msg.channel.send({ embed: {
                            title: `Whoops 🔥`,
                            description: `You can't apply for a job you already have! You'll have to wait for a raise.`,
                            color: client.colors.warning
                        }});
                        return;
                    }

                    if (profile.getCooldown("work", true, msg).response) return;
                    

                    if  (profile.work.job == "None") {
                        profile.work.job = applyingFor;
                        profile.save();

                        msg.channel.send({embed: {
                            title: `Congrats 🎉`,
                            description: `You were accepted as a ${JobList.formatName[applyingFor]}! Congrats on your first job.`,
                            color: client.colors.success
                        }});
                        return;
                    } else {
                        var chance = Math.random() * 100;

                        if (chance > 85) {
                            msg.channel.send({ embed: {
                                title: `Whoops 🔥`,
                                description: `You failed the interview and were denied the job.`,
                                color: client.colors.error
                            }});
                            return;
                        } else {
                            profile.work.job = applyingFor;
                            profile.save();
                            msg.channel.send({ embed: {
                                title: `Congrats 🎉`,
                                description: `You were accepted as a ${JobList.formatName[applyingFor]}! Congrats on your new job.`,
                                color: client.colors.success
                            }});
                            return;
                        }
                    }
                } else {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `You can't apply for this job! Do \`${guildPrefix}apply\` to see a list of available jobs!`,
                        color: client.colors.warning
                    }});
                    return;
                }
            } else {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `That isn't a valid job! Do \`${guildPrefix}apply\` to see a list of available jobs!`,
                    color: client.colors.warning
                }});
                return;
            }
        }
    }
}