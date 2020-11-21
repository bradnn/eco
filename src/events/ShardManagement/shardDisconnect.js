module.exports = class {
    async run(error, shard) {
        console.warn(`EcoBot: Shard disconnected with error:` + error.message);
    }
}