const serverModel = require('../../models/Server.js');
const userModel = require('../../models/User.js');
const { AuctionItems } = require('../../models/AuctionItems');
const { GemUtils } = require('../wallet/gems.js');
const { CoinUtils } = require('../wallet/coins.js');

module.exports.AuctionUtils = {
    update: async function(serverID) {
		let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await serverModel.create({
				serverID: serverID
			});
        }
        
        if(x.auctions.first.auction.endTime - 900 < Date.now()) {
            var itemList = Object.keys(AuctionItems.items);
            var startBids = Object.values(AuctionItems.startBids);
            var itemTypes = AuctionItems.items;
            var selection = Math.floor(Math.random() * itemList.length);
            var item = itemList[selection];
            var startBid = startBids[selection];

            let y = await userModel.findOne({userID: x.auctions.first.lastBidder.userID}, async function (err, res) {
                if(err) throw err;
                if (res) {
                    return res;
                }
            });
            if (!y) {
                y = await userModel.create({
                    userID: x.auctions.first.lastBidder.userID
                });
            }
            y.collections[itemTypes[x.auctions.first.auction.item]][x.auctions.first.auction.item] += x.auctions.first.auction.amount;
            y.save();

            var increment = 5;

            if(AuctionItems.currencyTypes[item] == "Gems") {
                var curType = "Gems";
            } else if (AuctionItems.currencyTypes[item] == "Coins") {
                var curType = "Coins";
            } else {
                var currencys = ["Gems", "Coins"];
            var numb = Math.floor(Math.random() * currencys.length);
            var curType = currencys[numb];
            }

            

            if(curType == "Gems") {
                startBid = startBid / 2000;
                increment = Math.floor(startBid / 100) + 50;
            } else {
                increment = startBid / 100;
            }
            

            x.auctions.first.auction.item = item;
            x.auctions.first.auction.amount = Math.floor(Math.random() * 1) + 1;
            x.auctions.first.auction.startingBid = startBid;
            x.auctions.first.auction.bidType = curType;
            x.auctions.first.auction.increment = increment;
            x.auctions.first.auction.endTime = Date.now() + 3600000; // 6 hours = 21600000
            x.auctions.first.auction.curBid = startBid;

            x.auctions.first.lastBidder.userID = "No bidder";
            x.auctions.first.lastBidder.amount = 0;
            await x.save();
        }
        if(x.auctions.second.auction.endTime - 900 < Date.now()) {
            var itemList = Object.keys(AuctionItems.items);
            var startBids = Object.values(AuctionItems.startBids);
            var itemTypes = AuctionItems.items;
            var selection = Math.floor(Math.random() * itemList.length);
            var item = itemList[selection];
            var startBid = startBids[selection];

            let y = await userModel.findOne({userID: x.auctions.second.lastBidder.userID}, async function (err, res) {
                if(err) throw err;
                if (res) {
                    return res;
                }
            });
            if (!y) {
                y = await userModel.create({
                    userID: x.auctions.second.lastBidder.userID
                });
            }
            y.collections[itemTypes[x.auctions.second.auction.item]][x.auctions.second.auction.item] += x.auctions.second.auction.amount;
            y.save();

            var increment = 150;

            if(AuctionItems.currencyTypes[item] == "Gems") {
                var curType = "Gems";
            } else if (AuctionItems.currencyTypes[item] == "Coins") {
                var curType = "Coins";
            } else {
                var currencys = ["Gems", "Coins"];
            var numb = Math.floor(Math.random() * currencys.length);
            var curType = currencys[numb];
            }

            

            if(curType == "Gems") {
                startBid = startBid / 2000;
                increment = Math.floor(startBid / 100) + 50;
            } else {
                increment = startBid / 100;
            }
            

            x.auctions.second.auction.item = item;
            x.auctions.second.auction.amount = Math.floor(Math.random() * 1) + 1;
            x.auctions.second.auction.startingBid = startBid;
            x.auctions.second.auction.bidType = curType;
            x.auctions.second.auction.increment = increment;
            x.auctions.second.auction.endTime = Date.now() + 10800000; // 6 hours = 21600000
            x.auctions.second.auction.curBid = startBid;

            x.auctions.second.lastBidder.userID = "No bidder";
            x.auctions.second.lastBidder.amount = 0;
            await x.save();
        }
        return x.auctions;
    },
    getItems: async function(serverID) {
		let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await serverModel.create({
				serverID: serverID
			});
        }
        
        return {
            first: x.auctions.second.auction.item,
            second: x.auctions.second.auction.item
        }

    },
    get: async function(serverID) {
        await this.update(serverID);
		let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await serverModel.create({
				serverID: serverID
			});
        }
        
        return x.auctions;

    },
    first: async function(arg, user, serverID) {
		let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await serverModel.create({
				serverID: serverID
			});
		}
		switch (arg) {
			case "get":
                if(x.auctions.first.auction.endTime - 900 < Date.now()) {
                    var update = this.update(serverID);
					return update;
				} else {
					return x.auctions.first.auction;
				}
			case "bid":

                if(x.auctions.first.auction.endTime - 900 < Date.now()) {
                    this.update(serverID);
                    return "AUCTION ENDED";
                }

				switch(x.auctions.first.auction.bidType) {
					case "Gems":
						var bidAmount = x.auctions.first.auction.curBid + x.auctions.first.auction.increment;
						
                        await GemUtils.del(user.id, bidAmount);

						if(x.auctions.first.lastBidder.userID != "No bidder") {
						    GemUtils.add(x.auctions.first.lastBidder.userID, x.auctions.first.lastBidder.amount);
                        }
						x.auctions.first.auction.curBid = bidAmount;
						x.auctions.first.lastBidder.userID = user.id;
						x.auctions.first.lastBidder.amount = bidAmount;
						await x.save();
						return;
					case "Coins":
						var bidAmount = x.auctions.first.auction.curBid + x.auctions.first.auction.increment;
						
                        await CoinUtils.del(user.id, bidAmount);

						if(x.auctions.first.lastBidder.userID != "No bidder") {
						    CoinUtils.add(x.auctions.first.lastBidder.userID, x.auctions.first.lastBidder.amount);
                        }
						x.auctions.first.auction.curBid = bidAmount;
						x.auctions.first.lastBidder.userID = user.id;
						x.auctions.first.lastBidder.amount = bidAmount;
						await x.save();
						return;
				}
				return;
        }
    },
    second: async function(arg, user, serverID) {
		let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
			if(err) throw err;
			if (res) {
				return res;
			}
		});
		if (!x) {
			x = await serverModel.create({
				serverID: serverID
			});
		}
		switch (arg) {
			case "get":
                if(x.auctions.second.auction.endTime - 900 < Date.now()) {
                    var update = await this.update(serverID);
					return update;
				} else {
					return x.auctions.second.auction;
				}
			case "bid":

                if(x.auctions.second.auction.endTime - 900 < Date.now()) {
                    this.update(serverID);
                    return "AUCTION ENDED";
                }

				switch(x.auctions.second.auction.bidType) {
					case "Gems":
						var bidAmount = x.auctions.second.auction.curBid + x.auctions.second.auction.increment;
						
                        await GemUtils.del(user.id, bidAmount);

						if(x.auctions.second.lastBidder.userID != "No bidder") {
							await GemUtils.add(x.auctions.second.lastBidder.userID, x.auctions.second.lastBidder.amount);
                        }
						x.auctions.second.auction.curBid = bidAmount;
						x.auctions.second.lastBidder.userID = user.id;
						x.auctions.second.lastBidder.amount = bidAmount;
						x.save();
						return;
					case "Coins":
						var bidAmount = x.auctions.second.auction.curBid + x.auctions.second.auction.increment;
						
                        await CoinUtils.del(user.id, bidAmount);

						if(x.auctions.second.lastBidder.userID != "No bidder") {
							await CoinUtils.add(x.auctions.second.lastBidder.userID, x.auctions.second.lastBidder.amount);
                        }
						x.auctions.second.auction.curBid = bidAmount;
						x.auctions.second.lastBidder.userID = user.id;
						x.auctions.second.lastBidder.amount = bidAmount;
						x.save();
						return;
				}
				return;
        }
    }
}