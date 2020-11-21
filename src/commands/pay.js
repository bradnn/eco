const { PayHandler } = require("../handlers/pay");
const { ProfileHandlers } = require("../handlers/profile");

module.exports = class {
    constructor() {
        this.cmd = 'pay'
    }

    async run(client, msg, args) {
        var handle = PayHandler.handler(client, msg, args);
        return handle;

    }
}