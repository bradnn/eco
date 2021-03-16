const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'crime'
        this.aliases = ['se', 'lockpick']
    }

    async run (client, msg, args) {

        let user = msg.author;
        var profile = await ProfileUtils.get(user.id);
        const jobList = Object.keys(JobList.pay);
        var jobIndex = jobList.indexOf(profile.work.job);

        if (jobIndex < 6 || profile.stats.townhall.depositAmount < 2500000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't access crimes unless you have the job ${JobList.formatName[jobList[6]]}+ and have deposited $2,500,000 to the town hall.`,
                color: client.colors.warning
            }});
            return;
        }

        const cooldown = await CooldownHandlers.get("crime", user, false);
        if (cooldown.response) {
            msg.channel.send(cooldown.embed);
            return;
        }

        msg.channel.send({embed: {
            title: `Crime 💰`,
            description: `How would you like to break in? Type one of the following: \`picking\`, \`bypass\`, \`social\`, or \`pickpocket\`.`,
            color: client.colors.warning
        }});

        var types = ['picking', 'bypass', 'social', 'pickpocket'];
        const filter = m => types.includes(m.content.toLowerCase());
        const collector = msg.channel.createMessageCollector(filter, { max: 1, time: 30000});

        collector.on('collect', async m => {
            const cooldown = await CooldownHandlers.get("crime", user);

            var type;
            switch(m.content.toLowerCase()) {
                case "picking":
                    type = "lockPicking";
                    break;
                case "bypass":
                    type = "lockBypass";
                    break;
                case "social":
                    type = "socialEngineering";
                    break;
                case "pickpocket":
                    type = "pickpocketing";
                    break;
            }

            var crimeLevel = profile.stats.crime.skillCounts[type];
            var chance = (Math.random() * 100) + Math.floor((crimeLevel + 1) * 0.5);

            var gainAmount = Math.floor(((profile.econ.wallet.balance / 100) * 1) * (crimeLevel + 1));
            var lossAmount = Math.floor((profile.econ.wallet.balance / 100) * 2.5);

            switch (type) {
                case "lockPicking":
                    var gainMessages = [`You successfully picked the lock to the local bank. You stole ${FormatUtils.money(gainAmount)}!`];
                    var lossMessages = [`You were caught picking the lock to the local bank. You were fined ${FormatUtils.money(lossAmount)}!`];
                    var gainIndex = Math.floor(Math.random() * gainMessages.length);
                    var lossIndex = Math.floor(Math.random() * lossMessages.length);
                    var gainMessage = gainMessages[gainIndex];
                    var lossMessage = lossMessages[lossIndex];
                    break;
                case "lockBypass":
                    var gainMessages = [`You slide a piece of metal behind the lock and slid it unlocked. You stole ${FormatUtils.money(gainAmount)}!`];
                    var lossMessages = [`You tried to slide a piece of metal behind a lock but someone saw you. You were fined ${FormatUtils.money(lossAmount)}!`];

                    var gainIndex = Math.floor(Math.random() * gainMessages.length);
                    var lossIndex = Math.floor(Math.random() * lossMessages.length);
                    
                    var gainMessage = gainMessages[gainIndex];
                    var lossMessage = lossMessages[lossIndex];
                    break;
                case "socialEngineering":
                    var gainMessages = [`You convinced a bank worker you were a janitor and got into the safe. You stole ${FormatUtils.money(gainAmount)}!`];
                    var lossMessages = [`You tried convincing a bank worker you were a janitor but they caught on. You were fined ${FormatUtils.money(lossAmount)}!`];

                    var gainIndex = Math.floor(Math.random() * gainMessages.length);
                    var lossIndex = Math.floor(Math.random() * lossMessages.length);
                    
                    var gainMessage = gainMessages[gainIndex];
                    var lossMessage = lossMessages[lossIndex];
                    break;
                case "pickpocketing":
                    var gainMessages = [`You grabbed someones wallet and it happened to have ${FormatUtils.money(gainAmount)} in it.`];
                    var lossMessages = [`You tried grabbing someones wallet but there was a police officer watching. You were fined ${FormatUtils.money(lossAmount)}`];

                    var gainIndex = Math.floor(Math.random() * gainMessages.length);
                    var lossIndex = Math.floor(Math.random() * lossMessages.length);
                    
                    var gainMessage = gainMessages[gainIndex];
                    var lossMessage = lossMessages[lossIndex];
                    break;
            }

            if (chance < 40) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: lossMessage,
                    color: client.colors.error
                }});
                profile.econ.wallet.balance -= Math.floor((profile.econ.wallet.balance / 100) * 2.5);
                profile.save();
            } else if (chance < 97) {
                msg.channel.send({ embed: {
                    title: `The job was successful 🏦`,
                    description: gainMessage,
                    color: client.colors.success
                }});
                profile.econ.wallet.balance += Math.floor(((profile.econ.wallet.balance / 100) * 1.5) * (crimeLevel + 1));
                profile.save();
            } else {
                msg.channel.send({ embed: {
                    title: `The job went better than expected 🔫`,
                    description: `${gainMessage}
You leveled up your ${m.content.toLowerCase()} skill to ${profile.crime.skills[type] +1}`,
                    color: client.colors.success
                }});
                profile.crime.skills[type] += 1;
                profile.econ.wallet.balance += Math.floor(((profile.econ.wallet.balance / 100) * 1) * (crimeLevel + 1));
                profile.save();
            }

        });

        
    }
}
