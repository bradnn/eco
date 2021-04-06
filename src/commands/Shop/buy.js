const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'buy',
        this.aliases = ['purchase']
        this.unlockLevel = 5;
    }

    async run(client, msg, args, options) {
        var itemChosen = args[0];
        var item = client.items.get(itemChosen);
        if (!item || !item.purchasable) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid item ID to purchase.`,
                color: client.colors.warning
            }});
            return;
        }
        var user = await User.get(msg.author), balance, itemAmount = parseInt(args[1]);

        if (isNaN(itemAmount)) itemAmount = 1;
        switch (item.currency) {
            case "coins": {
                balance = user.getCoins()
                break;
            }
            case "gems": {
                balance = user.getGems();
                break;
            }
        }

        if (balance < item.buyPrice * itemAmount) {
            msg.channel.send({ 
                embed: {
                    title: `Whoops 🔥`,
                    description: `You don't have enough ${item.currency} to buy this!`,
                    color: client.colors.warning
                }
            });
            return;
        }

        
        switch (item.currency) {
            case "coins": {
                balance = user.delCoins(item.buyPrice * itemAmount)
                break;
            }
            case "gems": {
                balance = user.delGems(item.buyPrice * itemAmount);
                break;
            }
        }

        user.addItem(item.id, itemAmount);
        user.save();
        msg.channel.send({ embed: {
            title: `Successfully Purhcased 🎉`,
            description: `You bought ${Number.numberComma(itemAmount)}x ${item.name} for ${Number.money(item.buyPrice * itemAmount)}!`,
            color: client.colors.success
        }})
    }
}