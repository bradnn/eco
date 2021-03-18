const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'mine',
        this.aliases = ['minefor']
    }

    async run(client, msg, args, guildPrefix) {
        
        var user = msg.author;
        var profile = await ProfileUtils.get(user.id);

        const cooldown = await CooldownHandlers.get("mine", user);
        if (cooldown.response) {
            msg.channel.send(cooldown.embed);
            return;
        }

        var chances = Math.random() * 100;
        var embed;

        if (chances < 98) {
            var gemAmount;
            if(profile.collections.mining.drill) {
                gemAmount = Math.floor(Math.random() * 199) + 850;
                profile.econ.wallet.gems += gemAmount;
                profile.stats.mining.timesMined += 1;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your drill!`,
                    color: client.colors.success
                }
            } else if (profile.collections.mining.pickaxe) {
                gemAmount = Math.floor(Math.random() * 99) + 100;
                profile.econ.wallet.gems += gemAmount;
                profile.stats.mining.timesMined += 1;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your pickaxe!`,
                    color: client.colors.success
                }
            } else {
                gemAmount = Math.floor(Math.random() * 49) + 1;
                profile.econ.wallet.gems += gemAmount;
                profile.stats.mining.timesMined += 1;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your shovel!`,
                    color: client.colors.success
                }
            }
        } else {
            if(profile.collections.mining.drill) {
                profile.collections.mining.drill -= 1;
                profile.save();
                embed = {
                    title: `You did a terrible job! 🔥`,
                    description: `You broke your drill!`,
                    color: client.colors.error
                }
            } else if (profile.collections.mining.pickaxe) {
                profile.collections.mining.pickaxe -= 1;
                profile.save();
                embed = {
                    title: `You did a terrible job! 🔥`,
                    description: `You broke your pickaxe!`,
                    color: client.colors.error
                }
            } else {
                embed = {
                    title: `You did a terrible job! 🔥`,
                    description: `You didn't mine any gems!`,
                    color: client.colors.error
                }
            }
        }

        msg.channel.send({ embed: embed});
        return;
    }
}