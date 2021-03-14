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
        var profile = await ProfileUtils.get(user.id);
        var robUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        let MAX_PAYOUT = 120000;
        let MIN_PAYOUT = 5000;

        if (profile.econ.wallet.balance < 2500) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't rob anyone if your balance is under $2,500.`,
                color: client.colors.warning
            }});
            return;
        }

        if(!robUser) {
            const cooldown = await CooldownHandlers.get("rob", user);
            if (cooldown.response) {
                msg.channel.send(cooldown.embed);
                return;
            }

            var payout = Math.floor((profile.econ.wallet.balance / 100 * 1) + MIN_PAYOUT);
            var chance = Math.floor(Math.random() * 100) + 1;

            if (payout > MAX_PAYOUT) payout = MAX_PAYOUT;

            if(chance < 70) {
                profile.econ.wallet.balance += payout;
                profile.save();
                msg.channel.send({ embed: {
                    title: `Nice Work 💼`,
                    description: `You just robbed someone on the street for ${FormatUtils.money(payout)}`,
                    color: client.colors.success
                }});
                return;
            } else {
                profile.econ.wallet.balance -= Math.floor(payout / 2);
                profile.save();
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You were caught robbing someone and got fined ${FormatUtils.money(Math.floor(payout / 2))}`,
                    color: client.colors.error
                }});
                return;
            }
        } else {
            
            var theirProfile = await ProfileUtils.get(robUser.id);
            var theirBalance = theirProfile.econ.wallet.balance;

            MAX_PAYOUT = 120000;

            if(theirBalance < MIN_PAYOUT) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You can't rob a new player! Please wait til they pass ${FormatUtils.money(MIN_PAYOUT)} in balance.`,
                    color: client.colors.warning
                }});
                return;
            }

            const cooldown = await CooldownHandlers.get("robUser", user);
            if (cooldown.response) {
                msg.channel.send(cooldown.embed);
                return;
            }

            var payout = Math.floor((theirBalance / 100 * 1) + MIN_PAYOUT);
            var chance = Math.floor(Math.random() * 100) + 1;

            if (payout > MAX_PAYOUT) payout = MAX_PAYOUT;

            if (chance > 65) {
                profile.econ.wallet.balance += payout;
                theirProfile.econ.wallet.balance -= payout;

                msg.channel.send({ embed: {
                    title: `Nice Work 💼`,
                    description: `You just robbed ${robUser.username} on the street for ${FormatUtils.money(payout)}`,
                    color: client.colors.success
                }});
                return;
            } else {
                profile.econ.wallet.balance -= Math.floor(payout / 2);
                theirProfile.econ.wallet.balance += Math.floor(payout / 2);

                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You were caught robbing ${robUser.username} and got fined ${FormatUtils.money(Math.floor(payout / 2))}`,
                    color: client.colors.error
                }});
                return;
            }
            

        }
        
    }
}