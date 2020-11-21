module.exports = class {
    async run(client, msg) {
        if (msg.channel.type == 1 || msg.author.bot) return;

        const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);
        if (msg.content.match(mentionRegex)) msg.channel.createMessage(`My prefix is \`${client.config.PREFIX}\``)
        const prefix = msg.content.match(mentionRegexPrefix) ? msg.content.match(mentionRegexPrefix)[0] : client.config.PREFIX;
        if (!msg.content.startsWith(prefix)) return;

        if(prefix.match(mentionRegexPrefix)) {
            msg.mentions.splice(0,1);
        }
        
        const [cmd, ...args] = await msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
        if (command) {
            try {
                var result = await command.run(client, msg, args);
                if(result == undefined) {
                    return;
                } else {
                    console.log(result);
                    msg.channel.createMessage(`There was an error! \`${result.err}\` at \`${result.time}\``)
                }
            } catch (e) {
                msg.channel.createMessage({
                    embed: {
                        color: 0xFFD100,
                        title: `There was an error running ${command}.`,
                        description: `The error has been reported, if this issue persists please report it.`
                    }
                });
                console.error(e.message, e.stack.split('\n'));
            }
        }

    }
};