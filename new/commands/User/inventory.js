const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'inventory',
        this.aliases = ['inven', 'items']
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

        var embed = {
            title: `${user.username}'s Inventory 🎒`,
            fields: []
        }

        var invObject = {};
        var lastField = 0;
        var userInventory = profile.getInventory();
        for (var itemID of Object.keys(userInventory)) {
            var item = client.items.get(itemID);
            if (!invObject[item.category]) {
                invObject[item.category] = {
                    field: lastField
                };
                embed.fields[lastField] = {
                    name: item.category,
                    value: ``,
                    inline: true
                }
                lastField++;
            }
            embed.fields[invObject[item.category].field].value += `${item.emoji} ${item.name} (${item.id}) **-** ${userInventory[item.id]}\n`;
            
        }

        if (embed.fields[0] == undefined) {
            embed.description = `You don't have any items!`;
        }

        msg.channel.send({embed: embed})
    }
}