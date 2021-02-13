const { ProfileUtils } = require("../../utils/profile/profile");
const { FormatUtils } = require("../../utils/format/format");
const {CooldownHandlers } = require("../../utils/cooldown/handler");



module.exports = class {
    constructor() {
        this.cmd = 'hunt',
        this.aliases = ['hunting'];
    }

    async run(client, msg, args, guildPrefix) {
        const cooldown = await CooldownHandlers.get("hunt", msg.author);
        if(cooldown.response){
            msg.channel.send(cooldown.embed);
            return;
        }
        var user = msg.author;
        var profile = await ProfileUtils.get(user.id);


        var chance = Math.floor(Math.random()*100)+1;
        if(chance<98){  //if user doesnt fail
            var earnings = Math.floor((Math.random()*2500) + 7499); //floor rounds up no matter what
                profile.econ.wallet.balance += earnings;
                profile.save()
                msg.channel.send({
                    embed: {
                        title: `Good Hunt 🏹`,
                        description: `You hunted and earned ${FormatUtils.money(earnings)}`,
                        color: client.colors.success
                    }
                });
             return;
        } else {
            msg.channel.send({
                embed: {
                    title: `You Failed ❌`,
                    description: `You came back from your journey empty handed.`,
                    color: client.colors.error
                }
            });
            return;
        }
    }
}