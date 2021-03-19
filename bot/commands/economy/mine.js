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
        var profile = await ProfileUtils.get(user, client);

        if (profile.getCooldown("mine", true, msg).response) return;
        

        var chances = Math.random() * 100;
        var embed;

        if (chances < 98) {
            var gemAmount;
            if (await profile.getItem(client, '007') > 0) {
                gemAmount = Math.floor(Math.random() * 199) + 850;
                profile.addGems(gemAmount) ;
                profile.addMineCount() ;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your drill!`,
                    color: client.colors.success
                }
            } else if (await profile.getItem(client, '006') > 0) {
                gemAmount = Math.floor(Math.random() * 99) + 100;
                profile.addGems(gemAmount) ;
                profile.addMineCount() ;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your pickaxe!`,
                    color: client.colors.success
                }
            } else {
                gemAmount = Math.floor(Math.random() * 49) + 1;
                profile.addGems(gemAmount) ;
                profile.addMineCount() ;
                profile.save();
                embed = {
                    title: `Great Job 🎉`,
                    description: `You mined ${FormatUtils.gem(gemAmount)} gems with your shovel!`,
                    color: client.colors.success
                }
            }
        } else {
            if(await profile.getItem(client, '007') > 0) {
                profile.delItem(client, '007') ;
                profile.save();
                embed = {
                    title: `You did a terrible job! 🔥`,
                    description: `You broke your drill!`,
                    color: client.colors.error
                }
            } else if (await profile.getItem(client, '006') > 0) {
                profile.delItem(client, '006') ;
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