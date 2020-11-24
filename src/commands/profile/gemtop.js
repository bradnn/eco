const { ProfileHandlers } = require("../../handlers/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'gemtop'
    }

    async run(client, msg, args) {
        var handle = ProfileHandlers.gemtop(client, msg, args);
        return handle;
    }
}