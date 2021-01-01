const { Items } = require("../../structures/models/Items");
const { FormatUtils } = require("../../utils/format/format");
const shopModel = require('../../structures/models/Shop.js');

module.exports = class {
    constructor() {
        this.cmd = 'shop',
        this.aliases = ['store']
    }

    async run(client, msg, args, prefix) {

        var categories = [];

        var categoryObj = {};
        var itemCategories = Items.categories;
        var itemList = Object.keys(itemCategories);

        var embed = {
            fields: [
                {
                    name: `hi`,
                    value: `hi`
                }
            ]
        }
        
        var pages = 0;
        var lastGivenID = 100;

        var cat;
        for (cat in itemCategories) {
            if (!categories.includes(itemCategories[cat])) {
                var category = itemCategories[cat];
                categoryObj[category] = {};
                var item;
                var itemCatCount = 0;
                var itemCatList = [];

                for (item in itemList) {
                    var item = itemList[item];
                    if(Items.categories[item] == category) {
                        itemCatList.push(item);
                        itemCatCount++;
                    }
                }
                categories.push(category);

                categoryObj[category] = {
                    count: itemCatCount
                }

                var pageCount = Math.floor(itemCatCount / 6);
                var pageAdded = 0;

                var catPageCount = 0;

                while (pageAdded <= pageCount) {
                    catPageCount++;
                    pageAdded++;
                    pages++;

                    categoryObj[pages] = {
                        category: category,
                        categoryPage: catPageCount
                    };

                    for (item in itemCatList) {
                        var item = itemCatList[item];
                        if(itemCatList.indexOf(item) < 6) {
                            if(Items.categories[item] == category) {
                                lastGivenID++;
                                categoryObj[pages][item] = {
                                    formatName: Items.formatName[item],
                                    currency: Items.transactionCurrency[item],
                                    price: Items.prices[item],
                                    emoji: Items.emojis[item],
                                    id: lastGivenID
                                }
                            }
                        }
                    }
                    itemCatList.splice(0, 6);
                }

                
            }
        }

        function getItemID(itemName) {
            var pageID;
            for (pageID in categoryObj) {
                var itemList = Object.keys(categoryObj[pageID]);
                if (itemList.includes(itemName)) {
                    return categoryObj[pageID][itemName].id;
                }
            }
        }

        var chosenPage = parseInt(args[0]) - 1;
        if(!chosenPage || isNaN(chosenPage)) {
            chosenPage = 0;
        }

        var itemList = ``;

        var res = await shopModel.findOne({userID: "776935174222249995"}, async function (err, res) {
            if (err) throw err;
        });
        if (!res) {
            res = await shopModel.create({userID: "776935174222249995"});
        }

        if(chosenPage == 0) {
            
            var allItems = Object.keys(Items.categories);

            if (res.superSale.resetTime <= Date.now()) {
                var itemIndex = Math.floor(Math.random() * allItems.length);
                var item2Index = Math.floor(Math.random() * allItems.length);

                if (itemIndex == item2Index) {
                    if ((item2Index + 1) > allItems.length) {
                        item2Index -= 1;
                    } else {
                        item2Index += 1;
                    }
                }
                
                res.superSale.item1 = allItems[itemIndex];
                res.superSale.item2 = allItems[item2Index];
                res.superSale.resetTime = Date.now() + 21600000;
            }

            if (res.shopFeatured.resetTime <= Date.now()) {
                var fitemIndex = Math.floor(Math.random() * allItems.length);
                var fitem2Index = Math.floor(Math.random() * allItems.length);
                var fitem3Index = Math.floor(Math.random() * allItems.length);

                if (fitemIndex == fitem2Index) {
                    if ((fitem2Index + 1) > allItems.length) {
                        fitem2Index -= 1;
                    } else {
                        fitem2Index += 1;
                    }
                } else if (fitem2Index == fitem3Index) {
                    if ((fitem3Index + 1) > allItems.length) {
                        fitem3Index -= 1;
                    } else {
                        fitem3Index += 1;
                    }
                } else if (fitemIndex == fitem3Index) {
                    if ((fitem3Index + 1) > allItems.length) {
                        fitem3Index -= 1;
                    } else {
                        fitem3Index += 1;
                    }
                }

                res.shopFeatured.item1 = allItems[fitemIndex];
                res.shopFeatured.item2 = allItems[fitem2Index];
                res.shopFeatured.item3 = allItems[fitem3Index];
                res.shopFeatured.resetTime = Date.now() + 10800000;
            }
            res.save();

            var featuredString = ``;

            var featuredItemList = ['item1', 'item2', 'item3'];

            var featuredItem;
            for(featuredItem in featuredItemList) {
                featuredItem = featuredItemList[featuredItem];

                if (res.superSale.item1 == res.shopFeatured[featuredItem]) {
                    featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${Items.emojis[res.shopFeatured[featuredItem]]} ${Items.formatName[res.shopFeatured[featuredItem]]} **-** ~~${FormatUtils.numberLetter(Items.prices[res.shopFeatured[featuredItem]])} ${Items.transactionCurrency[res.shopFeatured[featuredItem]]}~~ ${FormatUtils.numberLetter((Items.prices[res.shopFeatured[featuredItem]] / 100) * 60)} ${Items.transactionCurrency[res.shopFeatured[featuredItem]]} (**40% OFF**)\n`
                } else if (res.superSale.item2 == res.shopFeatured[featuredItem]) {
                    featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${Items.emojis[res.shopFeatured[featuredItem]]} ${Items.formatName[res.shopFeatured[featuredItem]]} **-** ~~${FormatUtils.numberLetter(Items.prices[res.shopFeatured[featuredItem]])} ${Items.transactionCurrency[res.shopFeatured[featuredItem]]}~~ ${FormatUtils.numberLetter((Items.prices[res.shopFeatured[featuredItem]] / 100) * 80)} ${Items.transactionCurrency[res.shopFeatured[featuredItem]]} (**20% OFF**)\n`
                } else {
                    featuredString += `#${getItemID(res.shopFeatured[featuredItem])} ${Items.emojis[res.shopFeatured[featuredItem]]} ${Items.formatName[res.shopFeatured[featuredItem]]} **-** ${FormatUtils.numberLetter(Items.prices[res.shopFeatured[featuredItem]])} ${Items.transactionCurrency[res.shopFeatured[featuredItem]]}\n`
                }
            }

            msg.channel.send({ embed: {
                title: `Home Page`,
                description: `**ON SALE** 🔥
#${getItemID(res.superSale.item1)} ${Items.emojis[res.superSale.item1]} ${Items.formatName[res.superSale.item1]} **-** ~~${FormatUtils.numberLetter(Items.prices[res.superSale.item1])} ${Items.transactionCurrency[res.superSale.item1]}~~ ${FormatUtils.numberLetter((Items.prices[res.superSale.item1] / 100) * 60)} ${Items.transactionCurrency[res.superSale.item1]} (**40% OFF**)
#${getItemID(res.superSale.item2)} ${Items.emojis[res.superSale.item2]} ${Items.formatName[res.superSale.item2]} **-** ~~${FormatUtils.numberLetter(Items.prices[res.superSale.item2])} ${Items.transactionCurrency[res.superSale.item2]}~~ ${FormatUtils.numberLetter((Items.prices[res.superSale.item2] / 100) * 80)} ${Items.transactionCurrency[res.superSale.item2]} (**20% OFF**)

**FEATURED** 😱
${featuredString}`,
                color: client.colors.default,
                footer: {
                    text: `Page ${chosenPage + 1}/${pages + 1} | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
                }
            }});
            return;
        }

        if ((chosenPage + 1) > 5) {
            chosenPage = 4;
        }

        var itemObj;
        for(itemObj in categoryObj[chosenPage]) {
            var obj =categoryObj[chosenPage][itemObj];
            if(obj.emoji != undefined) {
                if(res.superSale.item1 == itemObj) {
                    itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ~~${FormatUtils.numberLetter(obj.price)} ${obj.currency}~~ ${FormatUtils.numberLetter((obj.price / 100) * 60)} ${obj.currency} (**40% OFF**)\n`
                } else if (res.superSale.item2 == itemObj) {
                    itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ~~${FormatUtils.numberLetter(obj.price)} ${obj.currency}~~ ${FormatUtils.numberLetter((obj.price / 100) * 80)} ${obj.currency} (**20% OFF**)\n`
                } else {
                    itemList += `#${obj.id} ${obj.emoji} ${obj.formatName} **-** ${FormatUtils.numberLetter(obj.price)} ${obj.currency}\n`
                }
            }
        }

        embed = {
            title: `${categoryObj[chosenPage].category} (Page ${categoryObj[chosenPage].categoryPage})`,
            description: `__#ID 📦 Item Name **-** Price__\n${itemList}`,
            footer: {
                text: `Page ${chosenPage + 1}/${pages + 1} | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
            },
            color: client.colors.default
        }

        msg.channel.send({embed: embed});
        return;

    }
}