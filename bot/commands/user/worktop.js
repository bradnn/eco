const cacheModel = require('../../structures/models/Cache.js');
const userModel = require('../../structures/models/User.js');
const { FormatUtils } = require('../../utils/format/format.js');

module.exports = class {
    constructor () {
        this.cmd = 'worktop'
        this.aliases = ['workt', 'wt']
    }

    async run (client, msg, args, gPrefix) {

        var res = await cacheModel.findOne({userID: "776935174222249995"}, async function (err, res) {
            if(err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = await cacheModel.create({
                userID: "776935174222249995"
            });
        }

        var db = res.worktop;

        if (db.cacheClearTime < Date.now()) {
            await userModel.find({}).sort([['stats.work.workCount', -1]]).exec(async function (err, docs) {

                var user1 = await client.users.fetch(docs[0].userID);
                var user2 = await client.users.fetch(docs[1].userID);
                var user3 = await client.users.fetch(docs[2].userID);
                var user4 = await client.users.fetch(docs[3].userID);
                var user5 = await client.users.fetch(docs[4].userID);
    
                res.worktop.user1.username = user1.username;
                res.worktop.user1.count = docs[0].stats.work.workCount;
                res.worktop.user2.username = user2.username;
                res.worktop.user2.count = docs[1].stats.work.workCount;
                res.worktop.user3.username = user3.username;
                res.worktop.user3.count = docs[2].stats.work.workCount;
                res.worktop.user4.username = user4.username;
                res.worktop.user4.count = docs[3].stats.work.workCount;
                res.worktop.user5.username = user5.username;
                res.worktop.user5.count = docs[4].stats.work.workCount;
    
                res.worktop.cacheClearTime = Date.now() + 300000;
    
                await res.save();

                return;
            });
        }

        msg.channel.send({ embed: {
            title: `Top Works 💼`,
            description: `🥇 **#1** ${db.user1.username} 💼 ${FormatUtils.gem(db.user1.count)}
🥈 **#2** ${db.user2.username} 💼 ${FormatUtils.gem(db.user2.count)}
🥉 **#3** ${db.user3.username} 💼 ${FormatUtils.gem(db.user3.count)}
🤮 **#4** ${db.user4.username} 💼 ${FormatUtils.gem(db.user4.count)}
💩 **#5** ${db.user5.username} 💼 ${FormatUtils.gem(db.user5.count)}`,
            color: client.colors.default
        }});
    }
}