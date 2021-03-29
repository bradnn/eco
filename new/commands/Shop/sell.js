const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'sell',
        this.aliases = ['byebyeitem']
        this.unlockLevel = 5;
    }

    async run(client, msg, args, options) {
        var itemChosen = args[0];
        var item = client.items.get(itemChosen);
        if (!item) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid item ID to sell.`,
                color: client.colors.warning
            }});
            return;
        }
        if (!item.sellable) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't sell this item!`,
                color: client.colors.warning
            }});
            return;
        }
        var user = await User.get(msg.author), itemAmount = user.getItem(item.id), sellAmount = parseInt(args[1]);

        if (isNaN(sellAmount)) sellAmount = 1;

        if (itemAmount < sellAmount) {
            msg.channel.send({ 
                embed: {
                    title: `Whoops 🔥`,
                    description: `You don't have enough ${item.name} to sell!`,
                    color: client.colors.warning
                }
            });
            return;
        }

        
        switch (item.currency) {
            case "coins": {
                user.addCoins(item.sellPrice * sellAmount)
                break;
            }
            case "gems": {
                user.addGems(item.sellPrice * sellAmount);
                break;
            }
        }

        user.delItem(item.id, sellAmount);
        user.save();
        msg.channel.send({ embed: {
            title: `Successfully Sold 🎉`,
            description: `You sold ${Number.numberComma(sellAmount)}x ${item.name} for ${Number.money(item.sellPrice * sellAmount)}!`,
            color: client.colors.success
        }})
    }
}