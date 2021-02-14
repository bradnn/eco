const { FinalWorkMessages } = require("../../structures/json/workmessages");
const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { Messages } = require("../../utils/message/messages");
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

        var job = profile.work.job;
        var embed;

        // const cooldown = await CooldownHandlers.get("work", user);
        // if (cooldown.response) {
        //     msg.channel.send(cooldown.embed);
        //     return;
        // }


        const scrambled = await Messages.sendScramble(msg, client); // Send an unscramble challenge
        switch (scrambled.response) {
            case "CORRECT": // If the user unscrambled the word correctly

                var rewardString = ``; // List of rewards the user has been given for this work.
                var penaltyString = ``; // List of penalties the user has recieved for this work.

                var chance = Math.random() * 100
                if (chance > 99) { // If the user should be fired (1% Chance)
                    var failMessage = FinalWorkMessages[profile.work.job].bad[Math.floor(Math.random() * FinalWorkMessages[profile.work.job].bad.length)]; // Chooses a random work fail message
                    embed = { // Sets the embed to be sent
                        title: `You're fired! 🔥`,
                        description: failMessage,
                        fields: [],
                        color: client.colors.error
                    };
                    profile.work.job = "begger"; // Set users job to begger (FIRED)
                    profile.work.raiseLevel = 0; // Reset raise level
                    profile.stats.work.workCountRaise = 0; // Resets progress to next raise
                    penaltyString += `💼 Lost Job\n`; // Adds lost job to the penalty list
                } else if (chance > 98) { // If the user should get sick (1% Chance)
                    embed = { // Sets the embed to be sent
                        title: `You got sick 🦠`,
                        description: `You caught a cold and are unable to work for 10 minutes!`,
                        color: client.colors.sick
                    }

                    profile.work.sick = true; // Set the user to be sick
                } else if (chance > 96) { // If the user should recieve double coins (2% Chance)
                    var perfectMessage = FinalWorkMessages[profile.work.job].perfect[Math.floor(Math.random() * FinalWorkMessages[profile.work.job].perfect.length)]; // Chooses a random perfect work message
                    var earnedCoins = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel) / 100)); // Calculates how much the user should earn
                    earnedCoins += Math.floor(earnedCoins / 2);
                    embed = {
                        title: `Amazing Job 🎊`,
                        description: perfectMessage,
                        fields: [],
                        color: client.colors.success
                    }

                    profile.stats.work.workCount += 1;
                    profile.stats.work.workCountRaise += 1;
                    profile.econ.wallet.balance += earnedCoins;
                    rewardString += `💰 +50% Earnings (PERFECT WORK)\n💰 +${FormatUtils.money(earnedCoins)}\n`
                } else { // Normal work
                    var goodMessage = FinalWorkMessages[profile.work.job].good[Math.floor(Math.random() * FinalWorkMessages[profile.work.job].good.length)]; // Chooses a random good work message
                    var earnedCoins = Math.floor(JobList.pay[job] + (JobList.pay[job] * (profile.work.raiseLevel) / 100)); // Calculates how much the user should earn

                    embed = {
                        title: `Good Job 🎉`,
                        description: goodMessage,
                        fields: [],
                        color: client.colors.success
                    }

                    profile.stats.work.workCount += 1;
                    profile.stats.work.workCountRaise += 1;
                    profile.econ.wallet.balance += earnedCoins;
                    rewardString += `💰 +${FormatUtils.money(earnedCoins)}\n`
                }
                break;
            case "INCORRECT":
                msg.channel.send({ embed: {
                    title: `Wrong Answer ❌`,
                    description: `That was the wrong answer! Try again.`,
                    color: client.colors.error
                }});
                return;
            case "NOT ANSWERED":
                msg.channel.send({ embed: {
                    title: `You didn't answer! ❌`,
                    description: `Your forgot to answer! Try again.`,
                    color: client.colors.error
                }});
                return;
        }

        var gemChance = Math.random() * 100;
        if (gemChance > 80) {
            var gemAmount = Math.floor(Math.random() * 49) + 1;
            profile.econ.wallet.gems += gemAmount;
            rewardString += `💎 +${FormatUtils.gem(gemAmount)}\n`
        }
        var curField = 0;
        if (penaltyString != ``) { // Dont add a penalty field if there is no penalty.
            embed.fields[curField] = {
                name: `Penalties 🔥`,
                value: penaltyString
            };
            curField++;
        }
        if (rewardString != ``) { // Dont add a rewards field if there is not rewards
            embed.fields[curField] = {
                name: `Rewards 💰`,
                value: rewardString
            };
            curField++;
        }

        profile.save();

        msg.channel.send({embed: embed});
    }
}