const { FinalWorkMessages } = require("../../structures/json/workmessages");
const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { Messages } = require("../../utils/message/messages");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'help',
        this.aliases = ['what']
    }

    async run(client, msg, args, guildPrefix) {

        const user = await ProfileUtils.get(msg.author, client);  

        if (user.getJob() == "None") {
            msg.channel.send({
                embed: {
                    title: `You don't have a job!`,
                    description: `Do \`${guildPrefix}apply\` to apply for a job!`,
                    color: client.colors.error
                }
            });
            return;
        }

        var job = user.getJob();
        var embed;

        if (user.getCooldown("work", true, msg).response) return;


        const scrambled = await Messages.sendScramble(msg, client); // Send an unscramble challenge
        switch (scrambled.response) {
            case "CORRECT": // If the user unscrambled the word correctly

                var rewardString = ``; // List of rewards the user has been given for this work.
                var penaltyString = ``; // List of penalties the user has recieved for this work.

                var chance = Math.random() * 100
                if (chance > 99) { // If the user should be fired (1% Chance)
                    var failMessage = FinalWorkMessages[job].bad[Math.floor(Math.random() * FinalWorkMessages[job].bad.length)]; // Chooses a random work fail message
                    embed = { // Sets the embed to be sent
                        title: `You're fired! 🔥`,
                        description: failMessage,
                        fields: [],
                        color: client.colors.error
                    };
                    user.resetRaise();
                    user.setJob("begger");
                    penaltyString += `💼 Lost Job\n`; // Adds lost job to the penalty list
                } else if (chance > 98) { // If the user should get sick (1% Chance)
                    embed = { // Sets the embed to be sent
                        title: `You got sick 🦠`,
                        description: `You caught a cold and are unable to work for 10 minutes!`,
                        fields: [],
                        color: client.colors.sick
                    }

                    user.setSick(true);
                } else if (chance > 96) { // If the user should recieve double coins (2% Chance)
                    var perfectMessage = FinalWorkMessages[profile.getJob()].perfect[Math.floor(Math.random() * FinalWorkMessages[profile.getJob()].perfect.length)]; // Chooses a random perfect work message

                    embed = {
                        title: `Amazing Job 🎊`,
                        description: perfectMessage,
                        fields: [],
                        color: client.colors.success
                    }

                    await user.addWork();
                    var earnedCoins = user.getPay(true, true);
                    rewardString += `💰 +50% Earnings (PERFECT WORK)\n💰 +${FormatUtils.money(earnedCoins)}\n`;
                } else { // Normal work
                    var goodMessage = FinalWorkMessages[job].good[Math.floor(Math.random() * FinalWorkMessages[job].good.length)]; // Chooses a random good work message

                    embed = { // Sets the embed to be sent
                        title: `Good Job 🎉`,
                        description: goodMessage,
                        fields: [],
                        color: client.colors.success
                    }
                    user.addWork();

                    var earnedCoins = user.getPay(false, true);
                    rewardString += `💰 +${FormatUtils.money(earnedCoins)}\n`; // Adds earned money to reward string
                }
                break;
            case "INCORRECT": // If the user unscambled the word incorrectly
                msg.channel.send({ embed: { // Sends wrong answer alert
                    title: `Wrong Answer ❌`,
                    description: `That was the wrong answer! Try again.`,
                    color: client.colors.error
                }});
                return;
            case "NOT ANSWERED": // If the user didn't answer the prompt
                msg.channel.send({ embed: { // Sends not answered alert
                    title: `You didn't answer! ❌`,
                    description: `Your forgot to answer! Try again.`,
                    color: client.colors.error
                }});
                return;
        }

        if (Math.random() * 100 > 95.5) {
            client.items.get('004').add(msg.author.id, 1);
            rewardString += `🖼 +1 Campbells Soup Can (UNCOMMON DROP)\n`;
        }

        if (Math.random() * 100 > 80) {
            var gemAmount = Math.floor(Math.random() * 50);

            user.addGems(gemAmount);
            rewardString += `💎 +${FormatUtils.gem(gemAmount)}\n`
        }

        if(user.getRaise().levelUp) {
            rewardString += `🔧 You got a raise! (+1% Bonus)\n`;
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
        embed = TipUtils.embedTip(embed, guildPrefix);

        user.save();
        msg.channel.send({embed: embed});
    }
}