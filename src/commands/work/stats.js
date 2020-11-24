const { StatHandlers } = require("../../handlers/work/stats");

module.exports = class {
    constructor() {
        this.cmd = 'stats'
        this.aliases = ['mystats'];
    }

    async run(client, msg, args) {
        var handle = StatHandlers.handler(client, msg, args);
        return handle;
    }
}