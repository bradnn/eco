const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'gift'
        this.aliases = ['senditem']
    }

    async run (client, msg, args, gPrefix) {

        var giftTo = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        var itemGifted = args[1];
        var giftAmount = parseInt(args[2]);

        if (!giftTo) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid user to send items to.`,
                color: client.colors.warning
            }});
            return;
        }

        var item = client.items.get(itemGifted);
        if (item == null) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid item ID to gift.`,
                color: client.colors.warning
            }});
            return;
        }

        if (!giftAmount || giftAmount < 1) {
            giftAmount = 1;
        }

        var profile = await ProfileUtils.get(msg.author, client);
        
        if(profile.model.collections[item.category][item.name] >= giftAmount) {
            var toProfile = await ProfileUtils.get(giftTo, client);


            profile.delItem(client, item.id, giftAmount);
            profile.addItem(client, item.id, giftAmount);

            profile.save();
            toProfile.save();

            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You just sent ${FormatUtils.numberComma(giftAmount)}x ${item.formatName} to ${giftTo.username}!`,
                color: client.colors.success
            }});
            return;
        } else {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You don't have enough of this item to gift!`,
                color: client.colors.warning
            }});
            return;
        }
        
    }
}