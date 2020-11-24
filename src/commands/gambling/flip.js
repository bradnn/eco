const { GambleHandler } = require("../../handlers/gambling");

module.exports = class {
    constructor() {
        this.cmd = 'flip'
        this.aliases = ['coinflip', 'cf'];
    }

    async run(client, msg, args) {
        var handle = GambleHandler.handler(client, msg, args, "flip");
        return handle;
    }
}