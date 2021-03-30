const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'craft',
        this.aliases = ['make']
        this.unlockLevel = 25;
    }

    async run(client, msg, args, options) {

    }
}