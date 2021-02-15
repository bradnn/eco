const { UnscrambleWords } = require("../../structures/json/unscramble");
const { FormatUtils } = require("../format/format");

module.exports.Messages = {
    sendMultipleChoice: async function (msg, choices, answer, messages) {
        msg.channel.send(choices[0]);
    },
    sendScramble: async function (msg, client) {
        var number = Math.floor(Math.random() * UnscrambleWords.length);
        var string = UnscrambleWords[number];
        var scrambled = string.split('').sort(function(){return 0.5-Math.random()}).join('');

        const filter = response => {
            return response.author.id === msg.author.id;
        }
        var response;

        await msg.channel.send({embed: {title: `Hey ${msg.author.username}! Unscramble the word ${scrambled} 🧩`, color: client.colors.warning}}).then(async () => {
            await msg.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
                .then(collected => {
                    if (FormatUtils.capitalize(collected.first().content.toLowerCase()) == string) {
                        response = "CORRECT";
                    } else {
                        response = "INCORRECT";
                    }
                })
                .catch(collected => {
                    response = "NOT ANSWERED";
                });
        });

        return { response: response};
    }
}