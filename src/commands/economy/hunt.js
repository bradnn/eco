const { ProfileUtils } = require("../../utils/profile/profile");
const { FormatUtils } = require("../../utils/format/format");
const {CooldownHandlers } = require("../../utils/cooldown/handler");
const { FailHuntMessages } = require("../../structures/json/huntmessages");



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
        if(chance<80){  //if user doesnt fail
            var earnings;
            if(profile.collections.hunting.spear) {
                earnings = Math.floor((Math.random()*2500) +9999);
                profile.econ.wallet.balance += earnings;
                profile.save()
                msg.channel.send({
                    embed: {
                        title: `Good Hunt ✅`,
                        description: `You successfully hunted with your Spear and earned ${FormatUtils.money(earnings)}, Good Job!`,//gives player the amount of money earned and message
                        color: client.colors.success
                    }
                });
            } else if(profile.collections.hunting.bow) {
                earnings = Math.floor((Math.random()*2500) +14999);
                profile.econ.wallet.balance += earnings;
                profile.save()
                msg.channel.send({
                    embed: {
                        title: `Good Hunt ✅`,
                        description: `You successfully hunted with your Bow and earned ${FormatUtils.money(earnings)}, Good Job!`,//gives player the amount of money earned and message
                        color: client.colors.success
                    }
                });
            } else {
                earnings = Math.floor((Math.random()*2500) +4999);
                profile.econ.wallet.balance += earnings;
                profile.save()
                msg.channel.send({
                    embed: {
                        title: `Good Hunt ✔`,
                        description: `You successfully hunted with your Sharpened Stick and earned ${FormatUtils.money(earnings)}, Good Job!`,//gives player the amount of money earned and message
                        color: client.colors.success
                    }
                });
            }
               
             return;
        } else {
            var failHuntMessage = FailHuntMessages[Math.floor(Math.random() * FailHuntMessages.length)]; //random message out of the array of messges set for hunting
            msg.channel.send({
                embed: {
                    title: `You Failed ❌`,
                    description: failHuntMessage,
                    color: client.colors.error
                }
            });
            return;
        }
    }
}