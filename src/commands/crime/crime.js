const { CrimeHandlers } = require("../../handlers/crime");

module.exports = class {
    constructor() {
        this.cmd = 'crime'
        this.aliases = ['breakin', 'rob', 'steal']
    }

    async run(client, msg, args) {
        var handler = CrimeHandlers.crime(client, msg, args);
        return;

    }
}