const { HouseHandler } = require("../../handlers/houses/house");

module.exports = class {
    constructor() {
        this.cmd = 'house',
        this.aliases = ['houses']
    }

    async run(client, msg, args, guildPrefix) {
        var handle = HouseHandler.handler(client, msg, args, guildPrefix);
        return handle;
    }
}