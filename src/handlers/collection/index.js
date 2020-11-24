const { AuctionItems } = require("../../models/AuctionItems");
const { UserUtils } = require("../../utils/user");

module.exports.CollectionHandler = {
    handler: async function(client, msg, args) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) user = msg.author;

        var itemString = ``;

        var profile = await UserUtils.get(user.id);
        var collections = Object.keys(profile.collections);
        collections.splice(collections.indexOf('$init'), 1);

        for(collection in collections) {
            collection = collections[collection];
            var items = Object.keys(profile.collections[collection]);
            items.splice(items.indexOf('$init'), 1);
            var collectionTitle = collection.charAt(0).toUpperCase() + collection.slice(1);
            itemString += `\n**${collectionTitle}**\n`;
            var itemAmount = 0;

            for(item in items) {
                item = items[item];
                var itemCount = profile.collections[collection][item];
                var itemName = AuctionItems.nameFormat[item];
                var itemEmoji = AuctionItems.emojis[item];

                if(itemCount > 0) {
                    itemAmount++;
                    itemString += `${itemEmoji} ${itemName} **-** ${itemCount}\n`;
                }
            }
            if(itemAmount <= 0) {
                itemString += `None\n`
            }
        }
        
        msg.channel.createMessage({embed: {
            title: `${user.username}'s Collection`,
            description: itemString
        }})


    }
}