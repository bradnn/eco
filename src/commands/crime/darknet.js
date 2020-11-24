const { CrimeHandlers } = require("../../handlers/crime");

module.exports = class {
    constructor() {
        this.cmd = 'darknet'
        this.aliases = ['darkweb', 'bm', 'blackmarket', 'darkmarket']
    }

    async run(client, msg, args) {
        var handler = CrimeHandlers.darknet(client, msg, args);
        return;
    }
}