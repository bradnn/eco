const {CooldownHandlers } = require("../../utils/cooldown/handler");
const { ProfileUtils } = require("../../utils/profile/profile");
const { FormatUtils } = require("../../utils/format/format");


module.exports = class {
    constructor() {
        this.cmd= 'paint'
        this.aliases = ['painting'];
    }

    async run(client, msg, args, guildPrefix) {

        const cooldown = await CooldownHandlers.get("paint", msg.author);

        var user = msg.author;
        var profile = await  ProfileUtils.get(user, client);

        if (await profile.getCooldown("paint", true, msg).response) return;

        var chance = Math.floor(Math.random()*100)+1;
        if(chance<80){
            var earnings;
            earnings = (+15000);
            profile.addCoins(earnings);
            profile.save();
            msg.channel.send({
                embed: {
                    title: `Amazing Work ✅`,
                    description: `You made an amazing piece of art and sold it for ${FormatUtils.money(earnings)}, Great work!`,
                    color: client.colors.success
                }
            });
            return;
        } else{
            msg.channel.send({
                embed: {
                    title: `You Failed ❌`,
                    description: `Oh No! You failed at making your latest masterpiece!😨`,
                    color: client.colors.error
                }
            });
            profile.save();
            return;
        }
    }
}