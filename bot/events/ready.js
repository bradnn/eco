module.exports = class {
    async run(client) {
        console.log(`${client.user.username}: Start successful.`);
        client.user.setActivity(`;help | In ${client.guilds.cache.size} servers!`, { type: 'WATCHING' });
    }
}