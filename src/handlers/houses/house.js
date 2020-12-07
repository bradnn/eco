const { HouseList } = require("../../models/Houses");
const { CollectionCount } = require("../../utils/items/collectioncount");
const { UserUtils } = require("../../utils/user");

module.exports.HouseHandler = {
    handler: async function (client, msg, args, prefix) {
        if(!args[0]) {
            this.menu(client, msg, args, prefix);
            return
        };

        let type = args[0].toLowerCase();

        switch(type) {
            case "":
                break;
        }
    },
    menu: async function(client, msg, args, prefix) {
        let user = msg.mentions[0] || client.users.get(args[0]);
        if (!user) user = msg.author;

        var profile = await UserUtils.get(user.id);
        
        var formatHouse = HouseList.formatName[profile.housing.house];
        var paintingLimit = HouseList.PaintingLimit[profile.housing.house];
        var garageLimit = HouseList.carLimit[profile.housing.house];

        CollectionCount.painting(profile.id);
        
        var embed = {
            author: {
                name: `${user.username}'s House`,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `House`,
                    value: `🏠 ` + formatHouse
                },
                {
                    name: `Storage`,
                    value: `🖼 Paintings: 0/${paintingLimit}\n🚗 Cars: 0/${garageLimit}`
                }
            ],
            footer: {
                text: `Do ${prefix}house list to view available houses.`
            }
        }

        msg.channel.createMessage({embed: embed});


    }
}