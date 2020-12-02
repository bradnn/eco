const { CrimeHandlers } = require("../../handlers/crime");

module.exports = class {
    constructor() {
        this.cmd = 'rob'
        this.aliases = ['steal']
    }

    async run(client, msg, args) {
        var handler = CrimeHandlers.rob(client, msg, args);
        return;
    }
}