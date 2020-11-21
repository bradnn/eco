const { WorkHandlers } = require("../handlers/working");

module.exports = class {
    constructor() {
        this.cmd = 'jobs'
    }

    async run(client, msg, args) {
        var handle = WorkHandlers.handler(client, msg, args, this.cmd);
        return handle;

    }
}