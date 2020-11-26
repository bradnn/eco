const { PrefixUtils } = require("../utils/server");

module.exports = class {
    constructor() {
        this.cmd = 'atest'
    }

    async run(client, msg, args, guildPrefix) {
        if(msg.member.permissions.has('administrator')) {
            if(!args[0]) {
                msg.channel.createMessage(`My prefix is \`${guildPrefix}\`. To change this do the command \`${guildPrefix}prefix <prefix>\``);
                return;
            }

            if(args[0].length > 3) {
                msg.channel.createMessage(`Prefixes cannot be longer than 3 characters`);
                return;
            }

            PrefixUtils.set(msg.member.guild.id, args[0]);
            msg.channel.createMessage(`Prefix set to ${args[0]}.`);

        } else {
            msg.channel.createMessage(`My prefix is \`${guildPrefix}\`. To change this you need \`Administrator\` permission!`);
        }
        return;
    }
}