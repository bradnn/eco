const { CollectionHandler } = require("../../handlers/profile/collection");

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