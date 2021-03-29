const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'mine',
        this.aliases = ['minefor']
        this.unlockLevel = 10;
    }

    async run(client, msg, args, options) {
        const user = options.author

        if (user.getTool() == "none") {
            msg.channel.send({ embed: {
                title: `Whoops! 🔥`,
                description: `You don't have a pickaxe to mine with... Buy one in \`${options.prefix}shop\``,
                color: client.colors.error
            }});
            return;
        }
        if (user.getCooldown("mine", true, msg).response) return;

        var chances = Math.random() * 100;
        var breakChance = Math.random() * 100;
        var embed, item, amount, rewardString = ``, field = 0;

        if (breakChance > 98) {
            var toolBroken = user.breakTool();
            user.save();
            msg.channel.send({ embed: {
                title: `Whoops! 🔥`,
                description: `You broke your ${toolBroken}! Buy another in \`${options.prefix}shop\``,
                color: client.colors.error
            }});
            return;
        }

        if (chances > 99) {
            // GIVE USER TANZANITE
            item = client.items.get('006');
            amount = Math.floor(Math.random() * 5 + 1);
        } else if (chances > 97.5) {
            // GIVE USER EMERALD
            item = client.items.get('007');
            amount = Math.floor(Math.random() * 6 + 1);
        } else if (chances > 90) {
            // GIVE USER DIAMOND
            item = client.items.get('008');
            amount = Math.floor(Math.random() * 8 + 2);
        } else if (chances > 75) {
            // GIVE USER GOLD
            item = client.items.get('009');
            amount = Math.floor(Math.random() * 14 + 4);
        } else {
            // GIVE USER STEEL
            item = client.items.get('00a');
            amount = Math.floor(Math.random() * 17 + 5);
        }

        if (user.getTool() == "tanzPickaxe") { amount * 1.25 };

        rewardString += `💎 You mined ${amount} ${item.name}!`

        user.addItem(item.id, amount);
        user.save();
        embed = {
            title: `Good job! ⛏`,
            description: `Good job mining, you came back with some rare metals.`,
            fields: []
        }

        if (rewardString != ``) {
            embed.fields[field] = {
                name: `Rewards 💰`,
                value: rewardString
            };
            field++;
        }


        msg.channel.send({ embed: embed});
    }
}