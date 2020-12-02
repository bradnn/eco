const { AuctionUtils } = require("../utils/auction/auction");

module.exports = class {
    async run(client) {
        console.log(`${client.user.username}: Ready in ${client.guilds.size} guilds.`);

        let name = {
            name: `with ${client.guilds.size} servers`,
            type: 1,
            url: `https://twitch.tv/imsycles`
        };
        client.editStatus("online", name);
    }
}