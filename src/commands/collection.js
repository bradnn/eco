const { CollectionHandler } = require("../handlers/collection");
const { ProfileHandlers } = require("../handlers/profile");

module.exports = class {
    constructor() {
        this.cmd = 'collection'
        this.aliases = ['items', 'inventory'];
    }

    async run(client, msg, args) {
        var handle = CollectionHandler.handler(client, msg, args);
        return handle;

    }
}