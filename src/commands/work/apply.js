const { WorkHandlers } = require("../../handlers/work/work");

module.exports = class {
    constructor() {
        this.cmd = 'apply'
    }

    async run(client, msg, args) {
        var handle = WorkHandlers.handler(client, msg, args, this.cmd);
        return handle;
    }
}