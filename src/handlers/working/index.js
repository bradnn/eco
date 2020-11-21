const { JobList } = require("../../models/Jobs.js");
const { CoinUtils } = require("../../utils/wallet/coins.js");
const { JobUtils } = require("../../utils/job.js");
const { MoneyUtils } = require("../../utils/wallet/money.js");
const { UserUtils } = require("../../utils/user.js");
const { CooldownHandlers } = require("../cooldown/index.js");
const { GemFormatUtils } = require("../../utils/wallet/gemFormat.js");
const { GemUtils } = require("../../utils/wallet/gems.js");

module.exports.WorkHandlers = {
    handler: async function (client, msg, args, type) {

        switch (type) {
            case "work":
                const cooldown = await CooldownHandlers.get(type, msg.author);
                if (cooldown.response) {
                    msg.channel.createMessage(cooldown.embed);
                    return;
                }
                this.work(client, msg, args);
                break;
            case "apply":
                this.apply(client, msg, args);
                break;
            case "jobs":
                this.jobs(client, msg, args);
                break;
        }

    },
    jobs: async function(client, msg, args) {
        let jobs = Object.keys(JobList.workReq);
        var embed = {
            title: `Here are all the jobs!`
        };
        var availableJobs = `__Job Name **-** Payment (Work Requirement)__\n\n`;
            for (job in jobs) {
                if(jobs[job] == "None" || jobs[job] == "begger") {
                    continue;
                }
                availableJobs += `${JobList.formatName[jobs[job]]} **-** ${MoneyUtils.format(JobList.pay[jobs[job]])} per work (${GemFormatUtils.format(JobList.workReq[jobs[job]])} times)\n`;
            }
            embed.description = availableJobs;

            msg.channel.createMessage({ embed: embed });
            return;
    },
    apply: async function (client, msg, args) {
        var user = msg.author;
        var profile = await UserUtils.get(user.id);
        let jobs = Object.keys(JobList.workReq);

        if (!args[0]) {
            var embed = {
                title: `Here are the jobs you can apply for!`
            };

            var availableJobs = ``;
            for (job in jobs) {
                if (JobList.workReq[jobs[job]] <= profile.stats.work.workCount) {
                    if (jobs[job] != "None" && profile.work.job != jobs[job] || jobs[job] != "begger" && profile.work.job != jobs[job]) {
                        availableJobs += `${JobList.formatName[jobs[job]]} **-** ${MoneyUtils.format(JobList.pay[jobs[job]])} per work\n`;
                    }
                }
            }

            if (availableJobs == ``) {
                availableJobs = `There is not jobs you can apply for! Work some more to meet requirements for new jobs.`;
                embed.color = 16729344;
            } else {
                embed.color = 16766720;
            }

            embed.description = availableJobs;

            msg.channel.createMessage({ embed: embed });
            return;
        } else {
            var applyingFor;
            if(!args[1]) {
                applyingFor = args[0].toLowerCase();
            } else {
                applyingFor = args[0].toLowerCase() + args[1].toLowerCase();
            }
        
            if (jobs.includes(applyingFor)) {
                var requirement = JobList.workReq[applyingFor];
                if (profile.stats.work.workCount >= requirement) {
                    const cooldown = await CooldownHandlers.get("apply", msg.author);
                    if (cooldown.response) {
                        msg.channel.createMessage(cooldown.embed);
                        return;
                    }
                    
                    if (profile.work.job == "None") {
                        JobUtils.set(user.id, applyingFor);
                        msg.channel.createMessage({
                            embed: {
                                title: `Congrats! 🎉`,
                                description: `You were accepted as a ${JobList.formatName[applyingFor]}! Congrats on your first job.`,
                                color: 65280
                            }
                        });
                        return;
                    } else {
                        if (profile.work.job == args[0]) {
                            msg.channel.createMessage({
                                embed: {
                                    title: `Whoops!`,
                                    description: `You can't apply for a job you already have! You'll just have to wait for a raise.`,
                                    color: 16729344
                                }
                            });
                            return;
                        }

                        var chance = Math.floor(Math.random() * 100);

                        if (chance > 75) {
                            msg.channel.createMessage({
                                embed: {
                                    title: `Whoops!`,
                                    description: `You failed the interview and were denied the job.`,
                                    color: 16711680
                                }
                            });
                            return;
                        } else {
                            JobUtils.set(user.id, args[0]);
                            msg.channel.createMessage({
                                embed: {
                                    title: `Congrats! 🎉`,
                                    description: `You were accepted as a ${JobList.formatName[applyingFor]}! Congrats on your new job.`,
                                    color: 65280
                                }
                            });
                            return;
                        }
                    }
                } else {
                    msg.channel.createMessage({
                        embed: {
                            title: `Whoops!`,
                            description: `You can't apply for this job! Do \`${client.config.PREFIX}apply\` to see a list of available jobs!`,
                            color: 16711680
                        }
                    });
                    return;
                }
            } else {
                msg.channel.createMessage({
                    embed: {
                        title: `Whoops!`,
                        description: `That isn't a valid job! Do \`${client.config.PREFIX}apply\` to see a list of available jobs!`,
                        color: 16711680
                    }
                });
                return;
            }
        }
    },
    work: async function (client, msg, args) {
        var user = msg.author;
        var profile = await UserUtils.get(user.id);

        if (profile.work.job == "None") {
            msg.channel.createMessage({
                embed: {
                    title: `You don't have a job!`,
                    description: `Do \`${client.config.PREFIX}apply\` to apply for a job!`,
                    color: 16729344
                }
            })
            return;
        } else {
            var job = profile.work.job;
            var chance = Math.random() * 100;

            if (chance < 97) {

                if (profile.stats.work.workCountRaise >= 25) {
                    await JobUtils.addRaise(user.id);
                    JobUtils.addCount(user.id);
                    var earnAmount = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel) / 10));
                    CoinUtils.add(user.id, earnAmount);
                    msg.channel.createMessage({
                        embed: {
                            title: `Great Job! 🎉`,
                            description: `You were paid ${MoneyUtils.format(earnAmount)} for this work and given a raise!`,
                            color: 65280
                        }
                    });
                    return;
                }

                JobUtils.addCount(user.id);
                var earnAmount = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel) / 10));
                CoinUtils.add(user.id, earnAmount);

                var embed = {
                    title: `Good Job! 🎉`,
                    description: `You were paid ${MoneyUtils.format(earnAmount)} for this work.`,
                    color: 65280
                }

                var gemsYes = Math.random() * 100;

                if(gemsYes > 80) {

                    var gemAmount = Math.floor(Math.random() * 29) + 1;

                    GemUtils.add(user.id, gemAmount);

                    embed.footer = {
                        text: `You have earned ${gemAmount} gems for doing a great job!`
                    }
                }

                msg.channel.createMessage({
                    embed: embed
                });
                return;
            } else {
                JobUtils.set(user.id, "begger");
                msg.channel.createMessage({
                    embed: {
                        title: `You suck at your job!`,
                        description: `You did a terrible job and are getting fired.`,
                        color: 16729344
                    }
                })
                return;
            }
        }
    }
}