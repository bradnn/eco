const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'rob'
        this.aliases = ['steal']
    }

    async run (client, msg, args) {
        let user = msg.author;
        var profile = await ProfileUtils.get(user, client);
        var robUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        let MAX_PAYOUT = 120000;
        let MIN_PAYOUT = 5000;

        if (profile. getCoins() < 2500) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't rob anyone if your balance is under $2,500.`,
                color: client.colors.warning
            }});
            return;
        }

        if(!robUser) {

            if (await profile.getCooldown("rob", true, msg).response) return; 

            var payout = Math.floor((profile.getCoins() / 100 * 1) + MIN_PAYOUT);
            var chance = Math.floor(Math.random() * 100) + 1;

            if (payout > MAX_PAYOUT) payout = MAX_PAYOUT;

            if(chance < 70) {
                profile.addCoins(payout);
                profile.save();
                msg.channel.send({ embed: {
                    title: `Nice Work 💼`,
                    description: `You just robbed someone on the street for ${FormatUtils.money(payout)}`,
                    color: client.colors.success
                }});
                return;
            } else {
                profile.delCoins( Math.floor(payout / 2));
                profile.save();
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You were caught robbing someone and got fined ${FormatUtils.money(Math.floor(payout / 2))}`,
                    color: client.colors.error
                }});
                return;
            }
        } else {
            
            var theirProfile = await ProfileUtils.get(robUser, client);
            var theirBalance = theirProfile.getCoins();

            MAX_PAYOUT = 120000;

            if(theirBalance < MIN_PAYOUT) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You can't rob a new player! Please wait til they pass ${FormatUtils.money(MIN_PAYOUT)} in balance.`,
                    color: client.colors.warning
                }});
                return;
            }

            if (await profile.getCooldown("robUser", true, msg).response) return; 

            var payout = Math.floor((theirBalance / 100 * 1) + MIN_PAYOUT);
            var chance = Math.floor(Math.random() * 100) + 1;

            if (payout > MAX_PAYOUT) payout = MAX_PAYOUT;

            if (chance > 65) {
                profile.addCoins(payout);
                theirProfile.delCoins(payout);

                msg.channel.send({ embed: {
                    title: `Nice Work 💼`,
                    description: `You just robbed ${robUser.username} on the street for ${FormatUtils.money(payout)}`,
                    color: client.colors.success
                }});
                return;
            } else {
                profile.delCoins( Math.floor(payout / 2));
                theirProfile.addCoins( Math.floor(payout / 2));

                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You were caught robbing ${robUser.username} and got fined ${FormatUtils.money(Math.floor(payout / 2))}`,
                    color: client.colors.error
                }});
                profile.save();
                return;
            }
            

        }
        
    }
}