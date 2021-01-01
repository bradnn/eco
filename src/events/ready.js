module.exports = class {
    async run(client) {
        console.log(`${client.user.username}: Ready in ${client.guilds.cache.size} guilds.`);

        

        let name = {
            name: `;help | In ${client.guilds.cache.size} servers!`,
            type: 1,
            url: `https://twitch.tv/imsycles`
        };
        client.user.setActivity(name, { type: 'STREAMING' });
    }
}