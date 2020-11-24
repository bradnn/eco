const { AuctionHandlers } = require("../../handlers/auctions");

module.exports = class {
    constructor() {
        this.cmd = 'auction',
        this.aliases = ['ah', 'auc']
    }

    async run(client, msg, args) {
        var handle = AuctionHandlers.handle(client, msg, args, this.cmd);
        return handle;

    }
}