const { AuctionItems } = require("../../models/AuctionItems");
const userModel = require("../../models/User");

module.exports.CollectionCount = {
    painting: async function (userID, item, amount) {
        let x = await userModel.findOne({userID: userID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = userModel.create({
                userID: userID
            });
        };
        var paintings = [];

        var itemList = Object.keys(AuctionItems.items);
        for(item in itemList) {
            if(AuctionItems.items[itemList[item]] == "paintings") {
                paintings.push(itemList[item]);
            }
        }

        console.log(paintings);

        var paintingCount = 0;

        for(painting in paintings) {
            console.log(x.collections.paintings[paintings[painting]]);
            paintingCount += x.collections.paintings[paintings[painting]];
        }

        console.log(paintingCount);
    }
}