const { PrefixUtils } = require("../../utils/server/prefix");

module.exports = class {
    async run(client, msg) {
        if (msg.channel.type == 1 || msg.author.bot) return;

        const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);
        var guildPrefix = await PrefixUtils.get(msg.member.guild.id);
        if (msg.content.match(mentionRegex)) msg.channel.send(`My prefix is \`${guildPrefix}\``)
        const prefix = msg.content.match(mentionRegexPrefix) ? msg.content.match(mentionRegexPrefix)[0] : guildPrefix;
        if (!msg.content.startsWith(prefix)) return;

        if(prefix.match(mentionRegexPrefix)) {
            msg.mentions.splice(0,1);
        }
        
        const [cmd, ...args] = await msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
        if (command) {
            try {
                var result = await command.run(client, msg, args, prefix);
                if(result == undefined) {
                    return;
                } else {
                    console.log(result);
                    console.log(cmd);
                    msg.channel.send(`There was an error! \`${result.err}\` at \`${result.time}\``);
                }
            } catch (e) {
                msg.channel.send({
                    embed: {
                        color: client.colors.error,
                        title: `There was an error running ${command}.`,
                        description: `If this error presists please join our discord server [here](https://discord.gg/kvphct3TfY).`
                    }
                });
                console.log(msg.member);
                console.error(e.message, e.stack.split('\n'));
            }
        }

    }
};