module.exports = class {
    constructor() {
        this.cmd = 'vote',
        this.aliases = ['votelink']
    }

    async run(client, msg, args, prefix) {
        msg.channel.send({embed: {
            title: `EcoBot Vote Links`,
            description: `Vote for us [here](https://ecobot.syclesdev.com/vote)!`,
            color: client.colors.default
        }})
        return;
    }
}