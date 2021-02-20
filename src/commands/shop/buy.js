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
        var itemChosen = args[0];
        var itemAmount = parseInt(args[1]);
            var itemObject = client.items.get (itemChosen);
            if (itemObject == null) {
                    msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `Please supply a valid item ID to purchase.`,
                    color: client.colors.warning
                }});
                return;
            } 
            var profile = await ProfileUtils.get(msg.author.id)
            var theircoins
            if(isNaN(itemAmount)) {itemAmount=1}
            switch(itemObject.currency){
                case "coins": 
                theircoins = profile.econ.wallet.balance
                    break;
                    case "gems":
                        theircoins = profile.econ.wallet.gems
                        break;
                        
            }
            if(theircoins <= itemObject.buyPrice *itemAmount){
                msg.channel.send ({ embed: {
                    title: `Whoops 🔥`,
                    description: `You don't have enough ${itemObject.currency} to buy this!`,
                    color: client.colors.warning
                }

                })
            }
            switch(itemObject.currency){
                case "coins":
                    profile.econ.wallet.balance -= itemObject.buyPrice *itemAmount
                    break;
                    case "gems": 
                        profile.econ.wallet.gems -= itemObject.buyPrice *itemAmount
                        break;
            }           
            profile.save()
            client.items.get(itemChosen).add(msg.author.id, itemAmount);
            msg.channel.send ({ embed: {
                title: `Success 🎉`,
                description: `You bought ${itemAmount}x ${itemObject.formatName} for ${itemObject.buyPrice *itemAmount}, Congratulations!`
            }

            })
//         // var itemList = Object.keys(Items.formatName);
//         var categories = Object.keys(Items);
//         var category;

//         var lastGivenID = 100;
//         var itemObj = {};

//         for (category in categories) {
//             category = categories[category];

//             var item;
//             for (item in Items[category]) {
//                 if (item != "formatTitle" && Items[category][item].purchasable == true) {
//                     lastGivenID++;
    
//                     var thisItemObj = Items[category][item];
    
//                     itemObj[lastGivenID] = {
//                         formatName: thisItemObj.formatName,
//                         currency: thisItemObj.transactionCurrency,
//                         price: thisItemObj.price,
//                         category: category,
//                         item: item
//                     }
//                 }
//             }
//         }
        
//         if (!itemChosen || isNaN(itemChosen) || !Object.keys(itemObj).includes(itemChosen.toString())) {
            // msg.channel.send({ embed: {
            //     title: `Whoops 🔥`,
            //     description: `Please supply a valid item ID to purchase.`,
            //     color: client.colors.warning
            // }});
            // return;
//         }

//         if (!itemAmount || isNaN(itemAmount)) {
//             itemAmount = 1;
//         }

//         var res = await shopModel.findOne({userID: "776935174222249995"}, async function (err, res) {
//             if (err) throw err;
//         });
//         if (!res) {
//             res = await shopModel.create({userID: "776935174222249995"});
//         }

//         var price = itemObj[itemChosen].price * itemAmount;
//         if (res.superSale.item1 == itemObj[itemChosen].item) {
//             price = (price / 100) * 60;
//         } else if (res.superSale.item2 == itemObj[itemChosen].item) {
//             price = (price / 100) * 80;
//         }

//         var profile = await ProfileUtils.get(msg.author.id);

        


//         switch(itemObj[itemChosen].currency) {
//             case "Gems":
//                 if (price > profile.econ.wallet.gems) {
//                     msg.channel.send({ embed: {
//                         title: `Whoops 🔥`,
//                         description: `You don't have enough gems for this!`,
//                         color: client.colors.warning
//                     }});
//                     return;
//                 }

//                 profile.econ.wallet.gems = profile.econ.wallet.balance - price;

//                 switch(itemObj[itemChosen].category) {
//                     case "currency":
//                         switch(itemObj[itemChosen].item) {
//                             case "gem":
//                                 profile.econ.wallet.gems = profile.econ.wallet.gems + itemAmount;
//                                 await profile.save();
//                                 break;
//                         }
//                         break;
//                     case "paintings":
//                         profile.collections.paintings[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                     case "cars":
//                         profile.collections.cars[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                     case "mining":
//                         profile.collections.mining[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                 }
//                 break;
//             case "Coins":
//                 if (price > profile.econ.wallet.balance) {
//                     msg.channel.send({ embed: {
//                         title: `Whoops 🔥`,
//                         description: `You don't have enough money for this!`,
//                         color: client.colors.warning
//                     }});
//                     return;
//                 }
//                 profile.econ.wallet.balance = profile.econ.wallet.balance - price;

//                 switch(itemObj[itemChosen].category) {
//                     case "currency":
//                         switch(itemObj[itemChosen].item) {
//                             case "gem":
//                                 profile.econ.wallet.gems += itemAmount;
//                                 await profile.save();
//                                 break;
//                         }
//                         break;
//                     case "paintings":
//                         profile.collections.paintings[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                     case "cars":
//                         profile.collections.cars[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                     case "mining":
//                         profile.collections.mining[itemObj[itemChosen].item] += itemAmount;
//                         await profile.save();
//                         break;
//                 }
//                 break;
//         }

        

//         msg.channel.send({ embed: {
//             title: `Purchase Successful 🎉`,
//             description: `You bought ${itemAmount}x ${itemObj[itemChosen].formatName} for ${FormatUtils.numberComma(price)} ${itemObj[itemChosen].currency}.`,
//             color: client.colors.success
//         }})
     }
 }