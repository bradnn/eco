const { TownHallHandlers } = require("../../handlers/townhall");

module.exports = class {
    constructor() {
        this.cmd = 'townhall',
        this.aliases = ['th']
    }

    async run(client, msg, args, guildPrefix) {
        var handle = TownHallHandlers.handler(client, msg, args, guildPrefix);
        return handle;
    }
}