const { ProfileUtils } = require("../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'vote',
        this.aliases = ['votelink']
    }

    async run(client, msg, args, prefix) {

        if (!args[0]) {

            msg.channel.send({embed: {
                title: `EcoBot Vote Links`,
                description: `Vote for us [here](https://ecobot.syclesdev.com/vote)!`,
                color: client.colors.default
            }})
            return;
        }

        if (args[0].toLowerCase() == "toggle") {
            var userProfile = await ProfileUtils.get(msg.author.id);

            if (userProfile.stats.votes.messageToggle == true) {
                userProfile.stats.votes.messageToggle = false;

                msg.channel.send({embed: {
                    title: `EcoBot Vote Message`,
                    description: `Your vote message has been disabled. If you want to recieve them again do ${prefix}vote toggle!`,
                    color: client.colors.default
                }})
            } else {
                userProfile.stats.votes.messageToggle = true;

                msg.channel.send({embed: {
                    title: `EcoBot Vote Message`,
                    description: `Your vote message has been enabled. Thank you for supporting our bot!`,
                    color: client.colors.default
                }})
            }

            userProfile.save();
            
            return;
        }
    }
}