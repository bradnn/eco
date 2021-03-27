const { Number } = require("../../modules/Number");
const { String } = require("../../modules/String");
const { User } = require("../../modules/User");
const userSchema = require("../../storage/userSchema");

module.exports = class {
    constructor() {
        this.cmd = 'leveltop',
        this.aliases = ['exptop']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {

        function expToLevel(exp) {
            return Math.floor(Math.floor(95 + Math.sqrt(9025 + 380 * exp )) / 190);
        }

        var userList = await userSchema.find({}).sort([['profiles.level.exp', -1]]).exec(async function (err, docs) {
            if (err) throw err;
            var user1 = await client.users.fetch(docs[0].userID);
            var user2 = await client.users.fetch(docs[1].userID);
            var user3 = await client.users.fetch(docs[2].userID);
            var user4 = await client.users.fetch(docs[3].userID);
            var user5 = await client.users.fetch(docs[4].userID);

            msg.channel.send({ embed: {
                title: `Top Levels ⭐`,
                description: `🥇 **#1** ${user1.username} ⭐ Level ${expToLevel(docs[0].profiles.level.exp)} (${Number.numberComma(docs[0].profiles.level.exp)} exp)
    🥈 **#2** ${user2.username} ⭐ Level ${expToLevel(docs[1].profiles.level.exp)} (${Number.numberComma(docs[1].profiles.level.exp)} exp)
    🥉 **#3** ${user3.username} ⭐ Level ${expToLevel(docs[2].profiles.level.exp)} (${Number.numberComma(docs[2].profiles.level.exp)} exp)
    🤮 **#4** ${user4.username} ⭐ Level ${expToLevel(docs[3].profiles.level.exp)} (${Number.numberComma(docs[3].profiles.level.exp)} exp)
    💩 **#5** ${user5.username} ⭐ Level ${expToLevel(docs[4].profiles.level.exp)} (${Number.numberComma(docs[4].profiles.level.exp)} exp)`,
                color: client.colors.default
            }});
            return;
        });
        return;
    }
}