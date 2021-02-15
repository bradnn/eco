const { Items } = require("../../structures/models/ItemList");
const { FormatUtils } = require("../../utils/format/format");
const shopModel = require('../../structures/models/Shop.js');

module.exports = class {
    constructor() {
        this.cmd = 'shop',
        this.aliases = ['store', 'auction', 'auc']
    }

    async run(client, msg, args, prefix) {

        var NewShopObj = {
            '1': {
                category: "Home Page"
            }
        };

        var usedPage = 2;
        var thisPageCount = 0;
        var categoryPageCount = 1;

        var curCategory;
        
        for (const [key, value] of client.items) {

            if (!value.purchasable) {
                continue;
            }

            if (curCategory == undefined) {
                curCategory = value.category;
            }
            if (curCategory != value.category) {
                usedPage++;
                thisPageCount = 0;
                curCategory = value.category;
                categoryPageCount = 1;
            }

            if (NewShopObj[usedPage] == undefined) {
                NewShopObj[usedPage] = {
                    category: value.categoryName,
                    pageNumber: categoryPageCount,
                    items: {}
                }
            }

            if(NewShopObj[usedPage].items[value.id] == undefined) {
                NewShopObj[usedPage].items[value.id] = value;
            }
            thisPageCount++;

            if (thisPageCount >= 5) {
                usedPage++;
                thisPageCount = 0;
                categoryPageCount++;
            }
        }

        var usedField = 0;

        var newEmbed = {};
        
        var pageChosen = args[0];

        if (!pageChosen) {
            pageChosen = 1;
        } else {
            pageChosen = parseInt(pageChosen);

            if(isNaN(pageChosen)) {
                var getPage;
                for (getPage in NewShopObj) {
                    var pageObj = NewShopObj[getPage];

                    if (pageObj.category.toLowerCase() == args[0].toLowerCase()) {
                        pageChosen = parseInt(getPage);
                        if(!isNaN(parseInt(args[1]))) {
                            pageChosen += (parseInt(args[1]) - 1);
                        }
                        break;
                    }
                }
            }
        }
        if (NewShopObj[pageChosen].pageNumber == undefined) {
            newEmbed.title = `${NewShopObj[pageChosen].category}`;
        } else {
            newEmbed.title = `${NewShopObj[pageChosen].category} (Page ${NewShopObj[pageChosen].pageNumber})`;
        }
        var pageString = `__ID 📦 Item Name **-** Price__\n`;
        for (item in NewShopObj[pageChosen].items) {
            var item = NewShopObj[pageChosen].items[item];
            var priceString = `${FormatUtils.numberLetter(item.buyPrice)} ${FormatUtils.capitalize(item.currency)}`;
            pageString += `${item.id} ${item.emoji} ${item.formatName} **-** ${priceString}\n`;
        }
        newEmbed.description = pageString;
        newEmbed.footer = {
            text: `Page ${pageChosen}/${usedPage - 1} (${NewShopObj[pageChosen].category}) | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
        }

        msg.channel.send({embed: newEmbed});




















//         var embed = {};

//         var categories = Object.keys(Items);
//         var allItemList = [];
//         var pages = 0;
//         var pageObj = {};
//         var lastGivenID = 100;
//         var category;

//         for (category in categories) {
//             category = categories[category];

//             var catItemCount = 0;
//             var catItemList = [];
//             var item;
//             for (item in Items[category]) {
//                 if (item != "formatTitle" && Items[category][item].purchasable == true) {
//                     catItemCount++;
//                     catItemList.push(item);
//                     allItemList.push(item);
//                 }
//             }

//             if (catItemCount <= 0) {
//                 continue;
//             }

//             var catPageCount = Math.floor(catItemCount / 6);
//             var catPageCountAdded = 0;

//             while (catPageCountAdded <= catPageCount) {
//                 catPageCountAdded++
//                 pages++;

//                 pageObj[pages] = {
//                     category: category,
//                     categoryPage: catPageCountAdded
//                 };

//                 for (item in catItemList) {
//                     var item = catItemList[item];
//                     if (catItemList.indexOf(item) < 6) {
//                         lastGivenID++;
//                         pageObj[pages][item] = {
//                             formatName: Items[category][item].formatName,
//                             category: category,
//                             currency: Items[category][item].transactionCurrency,
//                             price: Items[category][item].price,
//                             emoji: Items[category][item].emoji,
//                             id: lastGivenID,
//                         }
//                     }
//                 }
//                 catItemList.splice(0, 6);
//             }


//         }


//         function getItemID (itemName) {
//             var pageID;
//             for (pageID in pageObj) {
//                 var itemList = Object.keys(pageObj[pageID]);
//                 if (itemList.includes(itemName)) {
//                     return pageObj[pageID][itemName].id;
//                 }
//             }
//         }

//         function getItemCategory (itemName) {
//             var pageID;
//             for (pageID in pageObj) {
//                 var itemList = Object.keys(pageObj[pageID]);
//                 if (itemList.includes(itemName)) {
//                     return pageObj[pageID][itemName].category;
//                 }
//             }
//         }

//         var chosenPage = parseInt(args[0]) - 1;
//         if (!chosenPage || isNaN(chosenPage)) {
//             chosenPage = 0;
//         }

//         var itemList = ``;

//         var res = await shopModel.findOne({userID: "776935174222249995"}, async function (err, res) {
//             if (err) throw err;
//         });
//         if (!res) {
//             res = await shopModel.create({userID: "776935174222249995"});
//         }

//         if(chosenPage == 0) {
            
//             var allItems = allItemList;

//             if (res.superSale.resetTime <= Date.now()) {
//                 var itemIndex = Math.floor(Math.random() * allItems.length);
//                 var item2Index = Math.floor(Math.random() * allItems.length);

//                 if (itemIndex == item2Index) {
//                     if ((item2Index + 1) > allItems.length) {
//                         item2Index -= 1;
//                     } else {
//                         item2Index += 1;
//                     }
//                 }
                
//                 res.superSale.item1 = allItems[itemIndex];
//                 res.superSale.item2 = allItems[item2Index];
//                 res.superSale.resetTime = Date.now() + 21600000;
//             }

//             if (res.shopFeatured.resetTime <= Date.now()) {
//                 var fitemIndex = Math.floor(Math.random() * allItems.length);
//                 var fitem2Index = Math.floor(Math.random() * allItems.length);
//                 var fitem3Index = Math.floor(Math.random() * allItems.length);

//                 if (fitemIndex == fitem2Index) {
//                     if ((fitem2Index + 1) > allItems.length) {
//                         fitem2Index -= 1;
//                     } else {
//                         fitem2Index += 1;
//                     }
//                 } else if (fitem2Index == fitem3Index) {
//                     if ((fitem3Index + 1) > allItems.length) {
//                         fitem3Index -= 1;
//                     } else {
//                         fitem3Index += 1;
//                     }
//                 } else if (fitemIndex == fitem3Index) {
//                     if ((fitem3Index + 1) > allItems.length) {
//                         fitem3Index -= 1;
//                     } else {
//                         fitem3Index += 1;
//                     }
//                 }

//                 res.shopFeatured.item1 = allItems[fitemIndex];
//                 res.shopFeatured.item2 = allItems[fitem2Index];
//                 res.shopFeatured.item3 = allItems[fitem3Index];
//                 res.shopFeatured.resetTime = Date.now() + 10800000;
//             }
//             res.save();

//             var featuredString = ``;

//             var featuredItemList = ['item1', 'item2', 'item3'];

//             var featuredItem;
//             for(featuredItem in featuredItemList) {
//                 featuredItem = featuredItemList[featuredItem];

//                 var itemCategory = getItemCategory(res.shopFeatured[featuredItem]).toLowerCase();

//                 var thisItemObj = Items[itemCategory][res.shopFeatured[featuredItem]];

//                 if (res.superSale.item1 == res.shopFeatured[featuredItem]) {
//                     featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${thisItemObj.emoji} ${thisItemObj.formatName} **-** ~~${FormatUtils.numberLetter(thisItemObj.price)} ${thisItemObj.transactionCurrency}~~ ${FormatUtils.numberLetter((thisItemObj.price / 100) * 60)} ${thisItemObj.transactionCurrency} (**40% OFF**)\n`
//                 } else if (res.superSale.item2 == res.shopFeatured[featuredItem]) {
//                     featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${thisItemObj.emoji} ${thisItemObj.formatName} **-** ~~${FormatUtils.numberLetter(thisItemObj.price)} ${thisItemObj.transactionCurrency}~~ ${FormatUtils.numberLetter((thisItemObj.price / 100) * 80)} ${thisItemObj.transactionCurrency} (**20% OFF**)\n`
//                 } else {
//                     featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${thisItemObj.emoji} ${thisItemObj.formatName} **-** ${FormatUtils.numberLetter(thisItemObj.price)} ${thisItemObj.transactionCurrency}\n`
//                 }
//             }

//             var saleString = ``;
//             var saleItemList = ['item1', 'item2'];
//             var saleItem;
//             for (saleItem in saleItemList) {
//                 saleItem = saleItemList[saleItem];

//                 var itemCategory = getItemCategory(res.superSale[saleItem]).toLowerCase();

//                 var thisItemObj = Items[itemCategory][res.superSale[saleItem]];
//                 switch (saleItem) {
//                     case "item1":
//                         saleString += `#${getItemID(res.superSale.item1)} ${thisItemObj.emoji} ${thisItemObj.formatName} **-** ~~${FormatUtils.numberLetter(thisItemObj.price)} ${thisItemObj.transactionCurrency}~~ ${FormatUtils.numberLetter((thisItemObj.price / 100) * 60)} ${thisItemObj.transactionCurrency} (**40% OFF**)\n`;
//                         break;
//                     case "item2":
//                         saleString += `#${getItemID(res.superSale.item2)} ${thisItemObj.emoji} ${thisItemObj.formatName} **-** ~~${FormatUtils.numberLetter(thisItemObj.price)} ${thisItemObj.transactionCurrency}~~ ${FormatUtils.numberLetter((thisItemObj.price / 100) * 80)} ${thisItemObj.transactionCurrency} (**20% OFF**)\n`;
//                         break;
//                 }
//             }

//             msg.channel.send({ embed: {
//                 title: `Home Page`,
//                 description: `**ON SALE** 🔥\n${saleString}

// **FEATURED** 😱
// ${featuredString}`,
//                 color: client.colors.default,
//                 footer: {
//                     text: `Page ${chosenPage + 1}/${pages + 1} | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
//                 }
//             }});
//             return;
//         }

//         if ((chosenPage + 1) > pages + 1) {
//             chosenPage = 4;
//         }

//         var itemObj;
//         for(itemObj in pageObj[chosenPage]) {
//             var obj =pageObj[chosenPage][itemObj];
//             if(obj.emoji != undefined) {
//                 if(res.superSale.item1 == itemObj) {
//                     itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ~~${FormatUtils.numberLetter(obj.price)} ${obj.currency}~~ ${FormatUtils.numberLetter((obj.price / 100) * 60)} ${obj.currency} (**40% OFF**)\n`
//                 } else if (res.superSale.item2 == itemObj) {
//                     itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ~~${FormatUtils.numberLetter(obj.price)} ${obj.currency}~~ ${FormatUtils.numberLetter((obj.price / 100) * 80)} ${obj.currency} (**20% OFF**)\n`
//                 } else {
//                     itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ${FormatUtils.numberLetter(obj.price)} ${obj.currency}\n`
//                 }
//             }
//         }

//         embed = {
//             title: `${pageObj[chosenPage].category} (Page ${pageObj[chosenPage].categoryPage})`,
//             description: `__#ID 📦 Item Name **-** Price__\n${itemList}`,
//             footer: {
//                 text: `Page ${chosenPage + 1}/${pages + 1} | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
//             },
//             color: client.colors.default
//         }

//         msg.channel.send({embed: embed});
        return;

    }
}