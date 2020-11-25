const { AuctionItems } = require("../../models/AuctionItems");
const { AuctionUtils } = require("../../utils/auction/auction");
const { TimeUtils } = require("../../utils/time");
const { UserUtils } = require("../../utils/user");
const { CoinUtils } = require("../../utils/wallet/coins");
const { GemUtils } = require("../../utils/wallet/gems");

module.exports.AuctionHandlers = {
    handle: async function (client, msg, args) {
        var profile = await UserUtils.get(msg.author.id);

        if(profile.stats.townhall.depositAmount < 1000000) {
            msg.channel.createMessage({
                embed: {
                    title: `Whoops!`,
                    description: `You have to contribute 1 Million to \`${client.config.PREFIX}th\` to access the auction house!`,
                    color: 16729344
                }
            });
            return;
        } else {
            var subCommand = args[0];

            switch (subCommand) {
                case "bid":

                    if(!args[1]) {
                        msg.channel.createMessage({
                            embed: {
                                title: `Whoops!`,
                                description: `This isn't a valid type of auction! The types are: \`first\` and \`second\``,
                                color: 16729344
                            }
                        });
                        return;
                    }
                    var bidtype = args[1].toLowerCase();

                    switch (bidtype) {
                        case "first":
                            this.bid(msg, msg.author, "first");
                            return;
                        case "second":
                            this.bid(msg, msg.author, "second");
                            return;
                        default:
                            msg.channel.createMessage({
                                embed: {
                                    title: `Whoops!`,
                                    description: `This isn't a valid type of auction! The types are: \`first\` and \`second\``,
                                    color: 16729344
                                }
                            });
                            return;
                    }
                default:
                    this.menu(msg, client);
            }
        }
    },
    menu: async function(msg, client) {
        var auctions = await AuctionUtils.get(msg.member.guild.id);

        var timeLeftFirst = TimeUtils.msToTime(auctions.first.auction.endTime - Date.now());
        var timeLeftSecond = TimeUtils.msToTime(auctions.second.auction.endTime - Date.now());

        let firstBidder;
        let secondBidder;

        if(auctions.first.lastBidder.userID == "No bidder") {
            firstBidder = "No Bidder";
        } else {
            firstBidder = `<@${auctions.first.lastBidder.userID}>`;
        }
        if(auctions.second.lastBidder.userID == "No bidder") {
            secondBidder = "No Bidder";
        } else {
            secondBidder = `<@${auctions.second.lastBidder.userID}>`;
        }
        
        var shopEmbed = {
            title: `AUCTION HOUSE`,
            description: `Bid on extremely rare items and grow your collection!`,
            color: 65433,
			fields: [
				{
					name: `FIRST AUCTION`,
                    value: `${AuctionItems.emojis[auctions.first.auction.item]} ${auctions.first.auction.amount}x ${AuctionItems.nameFormat[auctions.first.auction.item]}**:**
Current Bid **-** ${auctions.first.auction.curBid} ${auctions.first.auction.bidType}
Last Bidder **-** ${firstBidder}
Bid Increment **-** ${auctions.first.auction.increment} ${auctions.first.auction.bidType}
Ending in **-** ${timeLeftFirst}`,
                },
				{
					name: `SECOND AUCTION`,
                    value: `${AuctionItems.emojis[auctions.second.auction.item]} ${auctions.second.auction.amount}x ${AuctionItems.nameFormat[auctions.second.auction.item]}**:**
Current Bid **-** ${auctions.second.auction.curBid} ${auctions.second.auction.bidType}
Last Bidder **-** ${secondBidder}
Bid Increment **-** ${auctions.second.auction.increment} ${auctions.second.auction.bidType}
Ending in **-** ${timeLeftSecond}`,
                },
            ]
		};
		msg.channel.createMessage({ embed: shopEmbed });

    },
    bid: async function (msg, user, type) {
        switch (type) {
            case "first":
                var auc = await AuctionUtils.first("get", msg.author, msg.member.guild.id);
                
                switch(auc.bidType) {
                    case "Gems":
						var bidAmount = auc.curBid + auc.increment;
						var theirGems = await GemUtils.get(user.id);

						if(theirGems >= bidAmount) {
							var result = await AuctionUtils.first("bid", user, msg.member.guild.id);
                            if(result == "AUCTION ENDED") {
                                msg.channel.createMessage({
                                    embed: {
                                        title: `Whoops!`,
                                        description: `This auction has ended! Refreshing the auction house now...`,
                                        color: 16729344
                                    }
                                });
                                return;
                            } else {
                                console.log(`You bid on ${auc.amount}x ${AuctionItems.nameFormat[auc.item]} for ${bidAmount} gems`);

                                msg.channel.createMessage(`You bid on ${auc.amount}x ${AuctionItems.nameFormat[auc.item]} for ${bidAmount} gems`);
                                return;
                            }
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} gems`);
							return;
						}
                    case "Coins":
						var bidAmount = auc.curBid + auc.increment;
						var theirCoins = await CoinUtils.get(user.id);

						if(theirCoins >= bidAmount) {
							var result = await AuctionUtils.first("bid", user, msg.member.guild.id);
                            if(result == "AUCTION ENDED") {
                                msg.channel.createMessage({
                                    embed: {
                                        title: `Whoops!`,
                                        description: `This auction has ended! Refreshing the auction house now...`,
                                        color: 16729344
                                    }
                                });
                                return;
                            } else {
                                msg.channel.createMessage(`You bid on ${auc.amount}x ${AuctionItems.nameFormat[auc.item]} for ${bidAmount} coins`);
                                return;
                            }
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} coins`);
							return;
						}
                }
                return;
            case "second":
                var auc = await AuctionUtils.second("get", msg.author, msg.member.guild.id);
                
                switch(auc.bidType) {
                    case "Gems":
						var bidAmount = auc.curBid + auc.increment;
						var theirGems = await GemUtils.get(user.id);

						if(theirGems >= bidAmount) {
							var result = await AuctionUtils.second("bid", user, msg.member.guild.id);
                            if(result == "AUCTION ENDED") {
                                msg.channel.createMessage({
                                    embed: {
                                        title: `Whoops!`,
                                        description: `This auction has ended! Refreshing the auction house now...`,
                                        color: 16729344
                                    }
                                });
                                return;
                            } else {
                                msg.channel.createMessage(`You bid on ${auc.amount}x ${AuctionItems.nameFormat[auc.item]} for ${bidAmount} gems`);
                                return;
                            }
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} gems`);
							return;
						}
                    case "Coins":
						var bidAmount = auc.curBid + auc.increment;
						var theirCoins = await CoinUtils.get(user.id);

						if(theirCoins >= bidAmount) {
							var result = await AuctionUtils.second("bid", user, msg.member.guild.id);
                            if(result == "AUCTION ENDED") {
                                msg.channel.createMessage({
                                    embed: {
                                        title: `Whoops!`,
                                        description: `This auction has ended! Refreshing the auction house now...`,
                                        color: 16729344
                                    }
                                });
                                return;
                            } else {
                                msg.channel.createMessage(`You bid on ${auc.amount}x ${AuctionItems.nameFormat[auc.item]} for ${bidAmount} coins`);
                                return;
                            }
						} else {
							msg.channel.createMessage(`You don't have enough money to bid on this item. You need ${bidAmount} coins`);
							return;
						}
                }
                return;
        }
    }
}