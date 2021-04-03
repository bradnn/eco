const { fstat } = require("fs");
const { User } = require("../../modules/User")
var fs = require('fs');

module.exports = class {
    constructor() {
        this.cmd = 'additem',
        this.aliases = ['additem']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        const staff = ['767877736739242025'];

        if (!staff.includes(msg.author.id)) {
            msg.channel.send(`You aren't a staff member.`);
            return;
        }

        function convertToHex(int) {
            var hex = int.toString(16);
            switch (hex.length) {
                case 1: {
                    hex = `00${hex}`;
                    break;
                }
                case 2: {
                    hex = `0${hex}`;
                    break;
                }
                default: {
                    break;
                }
            }

            return hex;
        }
        var highestID = 0;
        for (const [key, value] of client.items) {
            var idInt = parseInt(value.id, 16);
            if (idInt > highestID) highestID = idInt;
        }

        var id = convertToHex(highestID += 1);
        var emoji, name, purchasable, sellable, currency, buyPrice, sellPrice, tier, category;

        const filter = response => {
            return response.author.id === msg.author.id;
        }

        await msg.channel.send(`What would you like to call this item? (Case Sensitive)`);
        await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                name = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What emoji would you like to give this item? (Only input a single emoji)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                emoji = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`Should this item be purchasable? (true or false)`);
        await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                purchasable = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`Should this item be sellable? (true or false)`);
        await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                sellable = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What currency will this item use? (coins or gems)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                currency = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What should the buy price be? (numbers only)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                buyPrice = parseInt(collected.first().content);
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What should the sell price be? (numbers only)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                sellPrice = parseInt(collected.first().content);
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What tier is this item? (common, uncommon, rare, epic, legendary)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                tier = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        await msg.channel.send(`What category is this item in? (Case Sensitive)`);
        await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (collected.first().content.toLowerCase() == "cancel") return;
                category = collected.first().content;
            })
            .catch(() => {
                msg.channel.send(`Cancelling item creation...`);
            });

        var fileData = `module.exports = class {
    constructor() {
        this.id = '${id}';

        this.name = '${name}';
        this.emoji = '${emoji}';

        this.purchasable = ${purchasable};
        this.sellable = ${sellable};
        this.currency = '${currency}';

        this.buyPrice = ${buyPrice};
        this.sellPrice = ${sellPrice};

        this.tier = '${tier}';
        this.category = '${category}';
    }
}`

        if (!fs.existsSync(`./src/storage/items/${category}`)) {
            await fs.mkdir(`./src/storage/items/${category}`, (err) => {
                if (err) {
                    throw err;
                }
                client.logger.item(`Directory ${category} didn't exist, creating it.`);
            });
        }

        await fs.writeFile(`./src/storage/items/${category}/${name}.js`, fileData, (err) => {
            if (err) {
                throw err;
            }
            client.logger.item(`Saved item ${name} in category ${category}`);
            const itemFile = require(`../../storage/items/${category}/${name}`);
            const itemClass = new itemFile();
    
            client.items.set(id, itemClass);
            client.logger.item(`Loading Item: ${name} (${id})`);
        });

        msg.channel.send(`Created the item ${emoji} ${name} (${id})`)
    }
}