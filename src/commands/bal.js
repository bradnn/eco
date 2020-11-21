const { ProfileHandlers } = require("../handlers/profile");

module.exports = class {
    constructor() {
        this.cmd = 'bal'
        this.aliases = ['balance', 'profile', 'user'];
    }

    async run(client, msg, args) {
        var handle = ProfileHandlers.handler(client, msg, args);
        return handle;

    }
}