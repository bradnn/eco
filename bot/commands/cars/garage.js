const { Items } = require("../../structures/models/ItemList");
const { JobList } = require("../../structures/models/Jobs");
const { FormatUtils } = require("../../utils/format/format");
const { TipUtils } = require("../../utils/message/tip");
const { ProfileUtils } = require("../../utils/profile/profile")

module.exports = class {
    constructor () {
        this.cmd = 'garage'
        this.aliases = ['cars', 'mycars']
    }

    async run (client, msg, args, gPrefix) {
        let user = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        if (!user) user = msg.author;

        var finalEmbed = {
            title: `${user.username}'s Garage 🏎`,
            fields: []
        }

        var lastField = 0;
        var infoObj = {};

        var profile = await ProfileUtils.get(user, client);
        var [cars, notCars] = client.items.partition(i => i.category === "cars");
        cars = cars.array();

        for (var car in cars) {
            const value = cars[car];
            
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
                finalEmbed.fields[infoObj[value.category].field].value += `${value.id} ${value.emoji} ${profile.model.collections[value.category][value.name]}x ${value.formatName} **-** Top Speed: ${value.maxSpeed} mph\n`;
            }
        }

        finalEmbed = TipUtils.embedTip(finalEmbed, gPrefix);

        msg.channel.send({ embed: finalEmbed});
        return;
    }
}