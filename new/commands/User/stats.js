const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'stats',
        this.aliases = ['stat', 'mystats']
    }

    async run(client, msg, args, guildPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        const profile = await User.get(user);

        var embed = {
            author: {
                name: `${user.username}'s Stats`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Working`,
                    value: `💼 Work Count **-** ${Number.numberComma(profile.getWorkCount())}`
                }
            ]
        }

        msg.channel.send({embed: embed})
    }
}