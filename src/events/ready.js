module.exports = class {
    async run(client) {
        client.logger.ready(`Successfully started ${client.user.username}`)
        client.user.setActivity(`;help | In ${client.guilds.cache.size} servers!`, { type: 'WATCHING' });
    }
}