const { WorkHandlers } = require("../handlers/working");

module.exports = class {
    constructor() {
        this.cmd = 'work',
        this.aliases = ['ork']
    }

    async run(client, msg, args) {
        var handle = WorkHandlers.handler(client, msg, args, this.cmd);
        return handle;
    }
}