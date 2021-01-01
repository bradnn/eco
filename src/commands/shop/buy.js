const { Items } = require("../../structures/models/Items");
const { FormatUtils } = require("../../utils/format/format");
const shopModel = require('../../structures/models/Shop.js');
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'buy',
        this.aliases = ['purchase']
    }

    async run(client, msg, args, prefix) {

        var itemChosen = parseInt(args[0]);
        var itemAmount = parseInt(args[1]);

        var itemList = Object.keys(Items.formatName);
        var item;
        var itemObj = {};

        var lastGivenID = 100;

        for (item in itemList) {
            item = itemList[item];

            lastGivenID++;

            itemObj[lastGivenID] = {
                formatName: Items.formatName[item],
                currency: Items.transactionCurrency[item],
                price: Items.prices[item],
                category: Items.categories[item],
                item: item
            }
        }
        
        if (!itemChosen || isNaN(itemChosen) || !Object.keys(itemObj).includes(itemChosen.toString())) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid item ID to purchase.`,
                color: client.colors.warning
            }});
            return;
        }

        if (!itemAmount || isNaN(itemAmount)) {
            itemAmount = 1;
        }

        var price = itemObj[itemChosen].price * itemAmount;
        var profile = await ProfileUtils.get(msg.author.id);

        


        switch(itemObj[itemChosen].currency) {
            case "Gems":
                if (price > profile.econ.wallet.gems) {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `You don't have enough gems for this!`,
                        color: client.colors.warning
                    }});
                    return;
                }

                profile.econ.wallet.gems -= price;

                switch(itemObj[itemChosen].category) {
                    case "Currency":
                        switch(itemObj[itemChosen].item) {
                            case "gem":
                                profile.econ.wallet.gems += itemAmount;
                                profile.save();
                                break;
                        }
                        break;
                    case "Paintings":
                        profile.collections.paintings[itemObj[itemChosen].item] += itemAmount;
                        profile.save();
                        break;
                    case "Cars":
                        profile.collections.cars[itemObj[itemChosen].item] += itemAmount;
                        profile.save();
                        break;
                }
                break;
            case "Coins":
                if (price > profile.econ.wallet.balance) {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `You don't have enough money for this!`,
                        color: client.colors.warning
                    }});
                    return;
                }

                profile.econ.wallet.balance -= price;

                switch(itemObj[itemChosen].category) {
                    case "Currency":
                        switch(itemObj[itemChosen].item) {
                            case "gem":
                                profile.econ.wallet.gems += itemAmount;
                                profile.save();
                                break;
                        }
                        break;
                    case "Paintings":
                        profile.collections.paintings[itemObj[itemChosen].item] += itemAmount;
                        profile.save();
                        break;
                    case "Cars":
                        profile.collections.cars[itemObj[itemChosen].item] += itemAmount;
                        profile.save();
                        break;
                }
                break;
        }

        

        msg.channel.send({ embed: {
            title: `Purchase Successful 🎉`,
            description: `You bought ${itemAmount}x ${Items.formatName[itemObj[itemChosen].item]} for ${FormatUtils.numberComma(price)} ${itemObj[itemChosen].currency}.`,
            color: client.colors.success
        }})
    }
}