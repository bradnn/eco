const { Items } = require("../../structures/models/ItemList");
const { FormatUtils } = require("../../utils/format/format");
const shopModel = require('../../structures/models/Shop.js');
const { ProfileUtils } = require("../../utils/profile/profile");
const { Message } = require("discord.js");

module.exports = class {
    constructor() {
        this.cmd = 'buy',
        this.aliases = ['purchase']
    }

    async run(client, msg, args, prefix) {
        var itemChosen = args[0]; // Item the user wants to buy
        var itemAmount = parseInt(args[1]); // Amount of this item the user wants to buy
            var itemObject = client.items.get(itemChosen); // Gets the item from the bot
            if (itemObject == null) { // If item doesn't exist send error
                    msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `Please supply a valid item ID to purchase.`,
                    color: client.colors.warning
                }});
                return;
            } 
            var profile = await ProfileUtils.get(msg.author, client); // Get users profile from database
            var theircoins;
            if(isNaN(itemAmount)) itemAmount = 1; // If the user didnt give an item amount or it wasn't a number, set item amount to 1
            switch(itemObject.currency){ // What currency is the item
                case "coins": 
                theircoins = profile.econ.wallet.balance;
                    break;
                    case "gems":
                        theircoins = profile.econ.wallet.gems;
                        break;
                        
            }
            if(theircoins <= itemObject.buyPrice *itemAmount){ // Check if the user has enough money, if not send error
                msg.channel.send({ 
                    embed: {
                        title: `Whoops 🔥`,
                        description: `You don't have enough ${itemObject.currency} to buy this!`,
                        color: client.colors.warning
                    }
                });
                return;
            }
            switch(itemObject.currency){ // Remove money based on currency
                case "coins":
                    profile.econ.wallet.balance -= itemObject.buyPrice *itemAmount;
                    break;
                    case "gems": 
                        profile.econ.wallet.gems -= itemObject.buyPrice *itemAmount;
                        break;
            }           
            profile.save(); // Save profile back to database
            client.items.get(itemChosen).add(msg.author.id, itemAmount); // Add item to user
            msg.channel.send ({ embed: { // Send purchase message
                title: `Success 🎉`,
                description: `You bought ${itemAmount}x ${itemObject.formatName} for ${FormatUtils.numberLetter(itemObject.buyPrice *itemAmount)}, Congratulations!`,
                color: client.colors.success
            }

            });
     }
 }