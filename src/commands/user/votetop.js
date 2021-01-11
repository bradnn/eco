const cacheModel = require('../../structures/models/Cache.js');
const userModel = require('../../structures/models/User.js');
const { FormatUtils } = require('../../utils/format/format.js');

module.exports = class {
    constructor () {
        this.cmd = 'baltop'
        this.aliases = ['balancetop', 'balt', 'bt']
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

        var db = res.votetop;

        if (db.cacheClearTime < Date.now()) {
            await userModel.find({}).sort([['stats.votes.voteCount', -1]]).exec(async function (err, docs) {

                var user1 = await client.users.fetch(docs[0].userID);
                var user2 = await client.users.fetch(docs[1].userID);
                var user3 = await client.users.fetch(docs[2].userID);
                var user4 = await client.users.fetch(docs[3].userID);
                var user5 = await client.users.fetch(docs[4].userID);
    
                db.user1.username = user1.username;
                db.user1.votes = docs[0].stats.votes.voteCount;
                db.user2.username = user2.username;
                db.user2.votes = docs[1].stats.votes.voteCount;
                db.user3.username = user3.username;
                db.user3.votes = docs[2].stats.votes.voteCount;
                db.user4.username = user4.username;
                db.user4.votes = docs[3].stats.votes.voteCount;
                db.user5.username = user5.username;
                db.user5.votes = docs[4].stats.votes.voteCount;
    
                db.cacheClearTime = Date.now() + 300000;
    
                await res.save();
            });
        }

        msg.channel.send({ embed: {
            title: `Top Votes 🎫`,
            description: `🥇 **#1** ${db.user1.username} 💸 ${FormatUtils.numberLetter(db.user1.votes)}
🥈 **#2** ${db.user2.username} 💸 ${FormatUtils.numberLetter(db.user2.votes)}
🥉 **#3** ${db.user3.username} 💸 ${FormatUtils.numberLetter(db.user3.votes)}
🤮 **#4** ${db.user4.username} 💸 ${FormatUtils.numberLetter(db.user4.votes)}
💩 **#5** ${db.user5.username} 💸 ${FormatUtils.numberLetter(db.user5.votes)}`,
            color: client.colors.default
        }});
    }
}