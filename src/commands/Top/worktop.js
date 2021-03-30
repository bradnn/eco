const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");
const userSchema = require("../../storage/userSchema");

module.exports = class {
    constructor() {
        this.cmd = 'worktop',
        this.aliases = ['balancetop']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        var userList = await userSchema.find({}).sort([['profiles.stats.work.workCount', -1]]).exec(async function (err, docs) {
            if (err) throw err;
            var user1 = await client.users.fetch(docs[0].userID);
            var user2 = await client.users.fetch(docs[1].userID);
            var user3 = await client.users.fetch(docs[2].userID);
            var user4 = await client.users.fetch(docs[3].userID);
            var user5 = await client.users.fetch(docs[4].userID);

            msg.channel.send({ embed: {
                title: `Top Workers 💼`,
                description: `🥇 **#1** ${user1.username} 💼 ${Number.numberComma(docs[0].profiles.stats.work.workCount)}
    🥈 **#2** ${user2.username} 💼 ${Number.numberComma(docs[1].profiles.stats.work.workCount)}
    🥉 **#3** ${user3.username} 💼 ${Number.numberComma(docs[2].profiles.stats.work.workCount)}
    🤮 **#4** ${user4.username} 💼 ${Number.numberComma(docs[3].profiles.stats.work.workCount)}
    💩 **#5** ${user5.username} 💼 ${Number.numberComma(docs[4].profiles.stats.work.workCount)}`,
                color: client.colors.default
            }});
            return;
        });
        return;
    }
}