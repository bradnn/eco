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

        var db = res.baltop;

        if (db.cacheClearTime < Date.now()) {
            await userModel.find({}).sort([['econ.wallet.balance', -1]]).exec(async function (err, docs) {

                var user1 = await client.users.fetch(docs[0].userID);
                var user2 = await client.users.fetch(docs[1].userID);
                var user3 = await client.users.fetch(docs[2].userID);
                var user4 = await client.users.fetch(docs[3].userID);
                var user5 = await client.users.fetch(docs[4].userID);
    
                res.baltop.user1.username = user1.username;
                res.baltop.user1.balance = docs[0].econ.wallet.balance;
                res.baltop.user2.username = user2.username;
                res.baltop.user2.balance = docs[1].econ.wallet.balance;
                res.baltop.user3.username = user3.username;
                res.baltop.user3.balance = docs[2].econ.wallet.balance;
                res.baltop.user4.username = user4.username;
                res.baltop.user4.balance = docs[3].econ.wallet.balance;
                res.baltop.user5.username = user5.username;
                res.baltop.user5.balance = docs[4].econ.wallet.balance;
    
                res.baltop.cacheClearTime = Date.now() + 300000;
    
                await res.save();
            });
        }

        msg.channel.send({ embed: {
            title: `Top Balance 💸`,
            description: `🥇 **#1** ${db.user1.username} 💸 ${FormatUtils.money(db.user1.balance)}
🥈 **#2** ${db.user2.username} 💸 ${FormatUtils.money(db.user2.balance)}
🥉 **#3** ${db.user3.username} 💸 ${FormatUtils.money(db.user3.balance)}
🤮 **#4** ${db.user4.username} 💸 ${FormatUtils.money(db.user4.balance)}
💩 **#5** ${db.user5.username} 💸 ${FormatUtils.money(db.user5.balance)}`,
            color: client.colors.default
        }});
    }
}