const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'mine',
        this.aliases = ['minefor']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        const user = options.author

        if (user.getPickaxe() == "none") {
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
            var toolBroken = user.breakPickaxe();
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

        if (user.getPickaxe() == "tanzPickaxe") { amount = Math.floor(amount * 1.25) };

        rewardString += `💎 You mined ${amount} ${item.name}!\n`

        var expAdded = user.addRandomExp();
        if(expAdded.levelUp) {
            rewardString += `⭐ Level Up! (+${Number.numberComma(expAdded.added)} exp)\n`
        } else {
            rewardString += `⭐ +${Number.numberComma(expAdded.added)} exp\n`;
        }

        user.addItem(item.id, amount);
        user.addMineCount();
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