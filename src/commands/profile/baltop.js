const { ProfileHandlers } = require("../../handlers/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'baltop'
        this.aliases = ['balancetop', 'profiletop', 'usertop'];
    }

    async run(client, msg, args) {
        var handle = ProfileHandlers.baltop(client, msg, args);
        return handle;
    }
}