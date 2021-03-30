const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'unlocks',
        this.aliases = ['levelunlocks']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {

        var unlocksObj = {};

        var unlockListString = ``

        var commandArray = client.commands.array()
        for (var value in commandArray) {
            if (commandArray[value].unlockLevel > 0) {
                if (!unlocksObj[commandArray[value].unlockLevel]) {
                    unlocksObj[commandArray[value].unlockLevel] = [];
                }
                unlocksObj[commandArray[value].unlockLevel].push(commandArray[value].cmd)
            }
        }
        
        for (var level in unlocksObj) {
            unlockListString += `**Level ${level}**\n`
            for (var unlockcmd in unlocksObj[level]) {
                unlockListString += `${options.prefix}${unlocksObj[level][unlockcmd]}\n`
            }
        }

        msg.channel.send({ embed: {
            title: `Level Unlocks`,
            description: unlockListString
        }});

    }
}