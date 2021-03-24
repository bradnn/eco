const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'work',
        this.aliases = ['ork']
    }

    async run(client, msg, args, guildPrefix) {
        const user = await User.get(msg.author);
        if (user.getCooldown("work", true, msg).response) return;

        var job = user.getJob();
        var embed;
        
        const scambled = await Challenge.scramble(msg, client);
        let rewardString = ``;
        let penaltyString = ``;
        switch (scambled.response) {
            case "CORRECT": {

                var chance = Math.random() * 100;
                if (chance > 99) {
                    embed = {
                        title: `You're fired! 🔥`,
                        description: client.jobs.get(job).getMessage('bad'),
                        fields: [],
                        color: client.colors.error
                    };
                    penaltyString += `💼 You lost your job, you'll have to apply again. (\`${guildPrefix}apply ${job}\`)\n`;
                    user.setRaise(0);
                    user.setJob('begger');
                } else if (chance > 98) {
                    embed = {
                        title: `You got sick 🦠`,
                        description: `You caught a cold and are unable to work for 10 minutes!`,
                        fields: [],
                        color: client.colors.sick
                    }
                    user.setSick(true);
                } else if (chance > 96) {
                    embed = {
                        title: `Amazing Job 🎊`,
                        description: client.jobs.get(job).getMessage('perfect'),
                        fields: [],
                        color: client.colors.success
                    }
                    await user.addWork();
                    var earnedCoins = user.getPay(true, true);
                    rewardString += `💰 +50% Earnings (PERFECT WORK)\n💰 +${Number.money(earnedCoins)}\n`;
                } else {
                    embed = {
                        title: `Good Job 🎉`,
                        description: client.jobs.get(job).getMessage('good'),
                        fields: [],
                        color: client.colors.success
                    }

                    await user.addWork();
                    var earnedCoins = user.getPay(false, true);
                    rewardString += `💰 +${Number.money(earnedCoins)}\n`;
                }
                break;
            }
            case "INCORRECT": {
                msg.channel.send({ embed: {
                    title: `Wrong Answer ❌`,
                    description: `That was the wrong answer! Try again.`,
                    color: client.colors.error
                }});
                return;
            }
            case "NOT ANSWERED": {
            msg.channel.send({ embed: {
                title: `You didn't answer! ❌`,
                description: `Your forgot to answer! Try again.`,
                color: client.colors.error
            }});
            return;
            }
        }

        if(user.canGetNextJob().canApply) {
            rewardString += `🎉 You can now apply for the next job! (\`${guildPrefix}apply ${user.canGetNextJob().nextJob.name}\`)`;
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

        user.save();
        msg.channel.send({embed: embed});
    }
}