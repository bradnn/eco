const { TownHallHandlers } = require("../handlers/townhall");

module.exports = class {
    constructor() {
        this.cmd = 'townhall',
        this.aliases = ['th']
    }

    async run(client, msg, args) {
        var handle = TownHallHandlers.handler(client, msg, args, this.cmd);
        return handle;

    }
}