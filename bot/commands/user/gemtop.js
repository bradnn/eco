const cacheModel = require('../../structures/models/Cache.js');
const userModel = require('../../structures/models/User.js');
const { FormatUtils } = require('../../utils/format/format.js');

module.exports = class {
    constructor () {
        this.cmd = 'gemtop'
        this.aliases = ['gemt', 'gt']
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

        var db = res.gemtop;

        if (db.cacheClearTime < Date.now()) {
            await userModel.find({}).sort([['econ.wallet.gems', -1]]).exec(async function (err, docs) {

                var user1 = await client.users.fetch(docs[0].userID);
                var user2 = await client.users.fetch(docs[1].userID);
                var user3 = await client.users.fetch(docs[2].userID);
                var user4 = await client.users.fetch(docs[3].userID);
                var user5 = await client.users.fetch(docs[4].userID);
    
                res.gemtop.user1.username = user1.username;
                res.gemtop.user1.gems = docs[0].econ.wallet.gems;
                res.gemtop.user2.username = user2.username;
                res.gemtop.user2.gems = docs[1].econ.wallet.gems;
                res.gemtop.user3.username = user3.username;
                res.gemtop.user3.gems = docs[2].econ.wallet.gems;
                res.gemtop.user4.username = user4.username;
                res.gemtop.user4.gems = docs[3].econ.wallet.gems;
                res.gemtop.user5.username = user5.username;
                res.gemtop.user5.gems = docs[4].econ.wallet.gems;
    
                res.gemtop.cacheClearTime = Date.now() + 300000;
    
                await res.save();

                return;
            });
        }

        msg.channel.send({ embed: {
            title: `Top Gems 💎`,
            description: `🥇 **#1** ${db.user1.username} 💎 ${FormatUtils.gem(db.user1.gems)}
🥈 **#2** ${db.user2.username} 💎 ${FormatUtils.gem(db.user2.gems)}
🥉 **#3** ${db.user3.username} 💎 ${FormatUtils.gem(db.user3.gems)}
🤮 **#4** ${db.user4.username} 💎 ${FormatUtils.gem(db.user4.gems)}
💩 **#5** ${db.user5.username} 💎 ${FormatUtils.gem(db.user5.gems)}`,
            color: client.colors.default
        }});
    }
}