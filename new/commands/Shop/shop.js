const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'shop',
        this.aliases = ['market', 'store']
        this.unlockLevel = 10;
    }

    async run(client, msg, args, options) {
        

        var NewShopObj = { // Define shop object
            '1': {
                category: "Home Page"
            }
        };

        var usedPage = 2; // the last used page
        var thisPageCount = 0; // How many items are on this page
        var categoryPageCount = 1; // How many pages this category has

        var curCategory; // What category its currently on
        
        for (const value of client.items.array().sort((a, b) => {return parseInt(a.id, 16) - parseInt(b.id, 16)})) { // Go through all items saved to bot

            if (!value.purchasable) { // If the item isnt purchasable, skip
                continue;
            }

            if (curCategory == undefined) { // If its the first category
                curCategory = value.category;
            }
            if (curCategory != value.category) { // If the category has changed since the last item
                usedPage++;
                thisPageCount = 0;
                curCategory = value.category;
                categoryPageCount = 1;
            }

            if (NewShopObj[usedPage] == undefined) { // If its a new page
                NewShopObj[usedPage] = {
                    category: value.category,
                    pageNumber: categoryPageCount,
                    items: {}
                }
            }

            if(NewShopObj[usedPage].items[value.id] == undefined) { // If the item doesn't already exist, make it
                NewShopObj[usedPage].items[value.id] = value;
            }
            thisPageCount++; // Add to this pages item count

            if (thisPageCount >= 5) { // if the page has 5 items or more, make a new page
                usedPage++;
                thisPageCount = 0;
                categoryPageCount++;
            }
        }
        
        var pageChosen = args[0]; // What page the user chose

        if (!pageChosen) { // If the user didnt choose a page
            pageChosen = 1;
        } else {
            pageChosen = parseInt(pageChosen); // Change page to int

            if(isNaN(pageChosen)) { // If its not a valid number, check if its a category name
                var getPage;
                for (getPage in NewShopObj) { // Go through every page
                    var pageObj = NewShopObj[getPage];

                    if (pageObj.category.toLowerCase() == args[0].toLowerCase()) { // If the page name matches an existing page
                        pageChosen = parseInt(getPage); // Set pagechosen to the int of the found page
                        if(!isNaN(parseInt(args[1]))) {
                            pageChosen += (parseInt(args[1]) - 1);
                        }
                        break;
                    }
                }
            }
        }

        function genEmbed(page, prefix) {
            var newEmbed = {};

            if (page === 1) {
                newEmbed.title = 'Home Page';
                newEmbed.description = 'The new shop is still in progress, sales and rotating shop coming soon!\nView the rest of the shop by reacting to this message.';
                return newEmbed;
            }


            if (NewShopObj[page].pageNumber == undefined) {
                newEmbed.title = `${NewShopObj[page].category}`;
            } else {
                newEmbed.title = `${NewShopObj[page].category} (Page ${NewShopObj[page].pageNumber})`;
            }
            var pageString = `__ID 📦 Item Name **-** Price__\n`;
            for (item in NewShopObj[page].items) {
                var item = NewShopObj[page].items[item];
                var priceString = `${Number.numberLetter(item.buyPrice)} ${String.capitalize(item.currency)}`;
                pageString += `${item.id} ${item.emoji} ${item.name} **-** ${priceString}\n`;
            }
            newEmbed.description = pageString;
            newEmbed.footer = {
                text: `Page ${page}/${usedPage} (${NewShopObj[page].category}) | ${prefix}shop <page> | ${prefix}buy <id> <amount>`
            }

            return newEmbed;
        }

        msg.channel.send({embed: genEmbed(pageChosen, options.prefix)}).then(message => {

            if (pageChosen === 1) {
                message.react('▶');
                // Main Page
            } else {
                message.react('◀');
                message.react('▶');
            }

            const collector = message.createReactionCollector(
                (reaction, user) => ['◀', '▶'].includes(reaction.emoji.name) && user.id === msg.author.id,

                {time: 60000}
            );

            collector.on('collect', reaction => {
                message.reactions.removeAll().then(() => {
                    if (reaction.emoji.name === '◀') {
                        pageChosen--;
                        message.edit({embed: genEmbed(pageChosen, options.prefix)});
                    } else {
                        pageChosen++;
                        message.edit({embed: genEmbed(pageChosen, options.prefix)});
                    }

                    if (pageChosen !== 1) message.react('◀');
                    if (pageChosen !== usedPage) message.react('▶');
                });
            })
        });
        return;

    }
}