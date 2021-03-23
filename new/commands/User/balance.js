const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'balance',
        this.aliases = ['bal', 'money']
    }

    async run(client, msg, args, guildPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        const profile = await User.get(user);

        var embed = {
            author: {
                name: `${user.username}'s Balance`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Wallet`,
                    value: `💷 Balance **-** ${Number.money(profile.getCoins())}\n💎 Gems **-** ${Number.gem(profile.getGems())}`
                }
            ]
        }

        msg.channel.send({embed: embed})
    }
}