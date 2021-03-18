const { Items } = require("../../structures/models/ItemList");
const { JobList } = require("../../structures/models/Jobs");
const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'collection'
        this.aliases = ['items']
    }

    async run (client, msg, args, gPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        var finalEmbed = {
            title: `${user.username}'s Collection 🗃`,
            fields: []
        }

        var lastField = 0;
        var infoObj = {};

        var profile = await ProfileUtils.get(user, client);

        for (const [key, value] of client.items) {
            if (profile.model.collections[value.category][value.name] > 0) {
                if (!infoObj[value.category]) {
                    infoObj[value.category] = {
                        field: lastField
                    };
                    lastField++;
                    finalEmbed.fields[infoObj[value.category].field] = {
                        name: value.categoryName,
                        value: ``,
                        inline: true
                    }
                }
                finalEmbed.fields[infoObj[value.category].field].value += `${value.emoji} ${value.formatName} **-** ${profile.model.collections[value.category][value.name]} \n`;
            }
        }

        finalEmbed = TipUtils.embedTip(finalEmbed, gPrefix);

        msg.channel.send({ embed: finalEmbed});
        return;
    }
}