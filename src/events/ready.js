const { AuctionUtils } = require("../utils/auction/auction");

module.exports = class {
    async run(client) {
        console.log(`${client.user.username} is ready now!`);

        let name = {
            name: `with your money`,
            type: 1,
            url: `https://twitch.tv/imsycles`
        };
        client.editStatus("online", name);
    }
}