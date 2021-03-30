const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");
const userSchema = require("../../storage/userSchema");

module.exports = class {
    constructor() {
        this.cmd = 'help',
        this.aliases = ['what']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {

        msg.channel.send({ embed: {
            title: `EcoBot Help Menu 💼`,
            description: `Quickstart guide [here](https://github.com/sycles/EcoBot/wiki)`,
            fields: [
                {
                    name: `Work Help`,
                    value: `[View help here](https://github.com/sycles/EcoBot/wiki/Working)`
                }
            ]
        }});

    }
}