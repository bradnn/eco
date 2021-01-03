const { Items } = require("../../structures/models/Items");
const { JobList } = require("../../structures/models/Jobs");
const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'profile'
        this.aliases = ['balance', 'bal', 'user']
    }

    async run (client, msg, args, gPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        var itemString = ``;

        var profile = await ProfileUtils.get(user.id);
        var collections = Object.keys(profile.collections);
        collections.splice(collections.indexOf('$init'), 1);
        
        var collection;
        for (collection in collections) {
            collection = collections[collection];
            var items = Object.keys(profile.collections[collection]);
            items.splice(items.indexOf('$init'), 1);
            var collectionTitle = collection.charAt(0).toUpperCase() + collection.slice(1);
            var itemAmount = 0;
            var item;
            var stringToAdd = ``;

            for (item in items) {
                item = items[item];
                var itemCount = profile.collections[collection][item];
                var itemName = Items.formatName[item];
                var itemEmoji = Items.emojis[item];

                if (itemCount > 0) {
                    itemAmount++;
                    stringToAdd += `${itemEmoji} ${itemName} **-** ${itemCount}\n`
                }
            }

            if (itemAmount <= 0) {
                continue;
            } else {
                itemString += `\n**${collectionTitle}**\n${stringToAdd}`;
            }
        }

        if(itemString == ``) {
            itemString = `None`;
        }

        var embed = {
            title: `${user.username}'s Collection 🗃`,
            description: itemString,
            color: client.colors.default
        }

        embed = TipUtils.embedTip(embed, gPrefix);

        msg.channel.send({ embed: embed});
        return;
    }
}