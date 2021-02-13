module.exports.Messages = {
    sendMultipleChoice: async function (msg, choices, answer, messages) {
        msg.channel.send(choices[0]);
    }
}