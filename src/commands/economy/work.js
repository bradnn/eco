const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'help',
        this.aliases = ['what']
    }

    async run(client, msg, args, guildPrefix) {

        var user = msg.author;
        var profile = await ProfileUtils.get(user.id);

        if (profile.work.job == "None") {
            msg.channel.send({
                embed: {
                    title: `You don't have a job!`,
                    description: `Do \`${guildPrefix}apply\` to apply for a job!`,
                    color: client.colors.error
                }
            });
            return;
        }

        const cooldown = await CooldownHandlers.get("work", user);
        if (cooldown.response) {
            msg.channel.send(cooldown.embed);
            return;
        }

        var job = profile.work.job;
        var chance = Math.random() * 100

        var embed;

        if (chance < 98) {
            if (profile.stats.work.workCountRaise >= 25) {

                var earnedCoins = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel + 1) / 10));
                
                profile.econ.wallet.balance += earnedCoins;
                profile.work.raiseLevel += 1;
                profile.stats.work.workCount += 1;
                profile.stats.work.workCountRaise = 0;

                embed = {
                    title: `Great Job 🎉`,
                    description: `You were paid ${FormatUtils.money(earnedCoins)} for this work and given a raise!`,
                    color: client.colors.success
                }
            } else {
                var earnedCoins = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel) / 10));
                profile.stats.work.workCount += 1;
                profile.stats.work.workCountRaise += 1;
                profile.econ.wallet.balance += earnedCoins;

                embed = {
                    title: `Great Job 🎉`,
                    description: `You were paid ${FormatUtils.money(earnedCoins)} for this work.`,
                    color: client.colors.success
                }
            }
        } else if (chance < 99) {
            profile.work.sick = true;

            embed = {
                title: `You got sick 🦠`,
                description: `You caught a cold and are unable to work for 10 minutes!`,
                color: client.colors.sick
            }
        } else {
            profile.work.job = "begger";
            profile.work.raiseLevel = 0;
            profile.stats.work.workCountRaise = 0;

            embed = {
                title: `You did a terrible job! 🔥`,
                description: `You did a terrible job and are getting fired.`,
                color: client.colors.error
            }
        }

        var gemChance = Math.random() * 100;
        if (gemChance > 80) {
            var gemAmount = Math.floor(Math.random() * 49) + 1;
            profile.econ.wallet.gems += gemAmount;
            embed.footer = {
                text: `You randomly found ${gemAmount} gems!`
            }
        }

        profile.save();

        msg.channel.send({embed: embed});
    }
}