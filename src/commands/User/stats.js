const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'stats',
        this.aliases = ['stat', 'mystats']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        var profile;
        if (!user) {
            user = msg.author;
            profile = options.author;
        } else {
            profile = await User.get(user);
        }

        var pickaxe = profile.getPickaxe();
        switch (pickaxe) {
            case "pickaxe": {
                pickaxe = "Pickaxe (005)";
                break;
            }
            case "tanzPickaxe": {
                pickaxe = "Tanzanite Pickaxe (00b)";
                break;
            }
            case "none": {
                pickaxe = "None";
                break;
            }
        }
        

        var embed = {
            author: {
                name: `${user.username}'s Stats`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `Leveling`,
                    value: `⭐ Level **-** ${profile.getLevel()} (${profile.getExp()} exp/${profile.getLevelReq()} exp)`
                },
                {
                    name: `Working`,
                    value: `💼 Work Count **-** ${Number.numberComma(profile.getWorkCount())}\n💼 Job **-** ${profile.getJob()}`
                },
                {
                    name: `Mining`,
                    value: `⛏ Current Pickaxe **-** ${pickaxe}`
                }
            ]
        }

        msg.channel.send({embed: embed})
    }
}