const { ProfileHandlers } = require("../../handlers/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'worktop'
        this.aliases = ['workstop', 'topworkers'];
    }

    async run(client, msg, args) {
        var handle = ProfileHandlers.worktop(client, msg, args);
        return handle;
    }
}