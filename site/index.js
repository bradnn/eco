const mongoose = require('mongoose');
var express = require('express');
var fs = require("fs");
var http = require('http');
var https = require('https');
require('dotenv').config();

var certificate = fs.readFileSync( './secret/cert.cer' );
var key = fs.readFileSync( './secret/priv.key' );
const User = require('./models/User');
const Server = require('./models/Server');
const Config = process.env;
var app = express();

mongoose.connect(Config.BOT_MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });



var path = require('path');

// app.use(function (req, res, next) {
//     if (req.secure) {
//         next();
//     } else {
//         if (req.url !== '/api/votehook') {
//             res.redirect('https://' + req.headers.host + req.url);
//         }
//     }
// });

app.use('/icon.ico', express.static('assets/icon.ico'));
app.use('/icon.png', express.static('assets/icon.png'));

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, '../views')));

app.get('/', async function (req, res) {


    res.render("main");
});

const Topgg = require('@top-gg/sdk');
const webhook = new Topgg.Webhook(Config.BOT_LIST_AUTH);

const Eris = require('eris');
class EcoBot extends Eris.Client {
    constructor(config, clientOptions) {
        super(config.BOT_TOKEN, clientOptions);
        this.config = config;
    };
};
const bot = new EcoBot(Config, { disableEveryone: true, restMode: true });

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook(Config.VOTE_WEBHOOK);

app.post('/dblwebhook', webhook.middleware(), async (req, res) => {

    let val = await User.findOne({userID: req.vote.user}, async function (err, val) {
        if (err) throw err;
        if (val) {
            return val;
        }
    });

    if(!val) {
        val = await User.create({
            userID: req.vote.user
        });
    }

    try {
        if (val.stats.votes.streak.lastVote) {
            if (val.stats.votes.streak.lastVote + 86400000 < Date.now()) {
                val.stats.votes.streak.lastVote = Date.now();
                val.stats.votes.streak.voteStreak += 1;
            } else {
                val.stats.votes.streak.lastVote = Date.now();
                val.stats.votes.streak.voteStreak = 0;
            }
        }

        var gemGain = 2500 + ( 2500 / 100) * (val.stats.votes.streak.voteStreak) * 5
        var coinGain = 20000 + ( 20000 / 100) * (val.stats.votes.streak.voteStreak) * 5

        val.stats.votes.voteCount += 1;
        val.econ.wallet.gems += gemGain;
        val.econ.wallet.balance += coinGain;
        var voteMessage = val.stats.votes.messageToggle;

        const IMAGE_URL = 'https://cdn.discordapp.com/avatars/776935174222249995/8eba884b7181fd550a1796554b59e0a5';
        hook.setUsername('EcoBot');
        hook.setAvatar(IMAGE_URL);

        var user1 = await bot.getRESTUser(req.vote.user);
        const embed = new MessageBuilder()
        .setTitle(`${user1.username} voted!`)
        .setDescription(`${user1.username} just voted at [top.gg](http://ecobot.sycles.me/vote) and earned ${gemGain} gems and $${coinGain}!`);
        hook.send(embed);

        if (voteMessage == true) {
            (await bot.getDMChannel(req.vote.user)).createMessage({ embed: {
                title: `Thank you! 🎊`,
                description: `Thank you for voting for our bot on [top.gg](http://ecobot.sycles.me/vote)!`,
                fields: [
                    {
                        name: `Rewards 💎`,
                        value: `You have been rewarded ${gemGain} gems and $${coinGain}.`
                    },
                    {
                        name: `Earn more! 🎫`,
                        value: `Everyday you will earn +5% more gems for your streak!\nEarn more gems, items, and balance from giveaways in our support server! [here](https://discord.gg/kvphct3TfY).`
                    }
                ],
                footer: {
                    text: `Don't want to recieve direct messages? Do ;vote toggle in a server to disable them!`
                },
                color: 65280
            }}).catch(() => {
                return;
            })
        }
        val.save();
        return;
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/docs', async function (req, res) {
    res.redirect('https://github.com/sycles/EcoBot/wiki');
})

app.get('/invite', async function (req, res) {
    res.redirect('https://discord.com/api/oauth2/authorize?client_id=776935174222249995&permissions=8&scope=bot');
})

app.get('/vote', async function (req, res) {
    res.redirect('https://top.gg/bot/776935174222249995/vote');
})

app.get('/user/:userID/:section?', async function (req, res) {

    var x = await User.findOne({userID: req.params.userID}, async function (err, res) {
        if(err) throw err;
        if (res) {
            return res;
        }
    })
    if(!x) {
        x = {success: false};
    };

    if(req.params.section) {
        x = {success: true, user: x.userID, data: x[req.params.section]};
        if(x.data == undefined) {
            x = {success: false};
        }
    } else {
        x = {success: true, user: x};
    }
    
    
    
    res.send(x);
});

app.get('/server/:serverID/:section?', async function (req, res) {

    var x = await Server.findOne({serverID: req.params.serverID}, async function (err, res) {
        if(err) throw err;
        if (res) {
            return res;
        }
    })
    if(!x) {
        x = {success: false};
    };

    if(req.params.section) {
        x = {success: true, server: x.serverID, data: x[req.params.section]};
        if(x.data == undefined) {
            x = {success: false};
        }
    } else {
        x = {success: true, server: x};
    }
    
    
    
    res.send(x);
});

var NUM_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function format(x) {
    var level = Math.log10(x) / 3 | 0;

    if(level == 0) return x;

    var numSuffix = NUM_SYMBOL[level];
    var scale = Math.pow(10, level * 3);
    var scaled = x / scale;

    return scaled.toFixed(1) + numSuffix;
}

// function format(x) {
//     return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }



bot.on('shardDisconnect', function(error, shard) {
    return;
});
bot.on('shardReady', function(error, shard) {
    return;
});
bot.on('shardResume', function(error, shard) {
    return;
});
bot.on('disconnected', function(error, shard) {
    return;
});
bot.on('error', function(error, shard) {
    return;
});

bot.connect();

app.get('/top', async function (req, res) {


    User.find({}).sort([['econ.wallet.balance', -1]]).exec(async function(err, docs) {

        var user1 = await bot.getRESTUser(docs[0].userID);
        var user2 = await bot.getRESTUser(docs[1].userID);
        var user3 = await bot.getRESTUser(docs[2].userID);
        var user4 = await bot.getRESTUser(docs[3].userID);
        var user5 = await bot.getRESTUser(docs[4].userID);
        var user6 = await bot.getRESTUser(docs[5].userID);
        var user7 = await bot.getRESTUser(docs[6].userID);
        var user8 = await bot.getRESTUser(docs[7].userID);
        var user9 = await bot.getRESTUser(docs[8].userID);
        var user10 = await bot.getRESTUser(docs[9].userID);

        let users = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];
        let balances = [format(docs[0].econ.wallet.balance), format(docs[1].econ.wallet.balance), format(docs[2].econ.wallet.balance), format(docs[3].econ.wallet.balance), format(docs[4].econ.wallet.balance), format(docs[5].econ.wallet.balance), format(docs[6].econ.wallet.balance), format(docs[7].econ.wallet.balance), 
        format(docs[8].econ.wallet.balance), format(docs[9].econ.wallet.balance)];
        let gems = [format(docs[0].econ.wallet.gems), format(docs[1].econ.wallet.gems), format(docs[2].econ.wallet.gems), format(docs[3].econ.wallet.gems), format(docs[4].econ.wallet.gems), format(docs[5].econ.wallet.gems), format(docs[6].econ.wallet.gems), format(docs[7].econ.wallet.gems), 
        format(docs[8].econ.wallet.gems), format(docs[9].econ.wallet.gems)];
        let workcounts = [format(docs[0].stats.work.workCount), format(docs[1].stats.work.workCount), format(docs[2].stats.work.workCount), format(docs[3].stats.work.workCount), format(docs[4].stats.work.workCount), format(docs[5].stats.work.workCount), format(docs[6].stats.work.workCount), format(docs[7].stats.work.workCount), 
        format(docs[8].stats.work.workCount), format(docs[9].stats.work.workCount)];

        res.render("top", {bot: bot.user, users: users, balances: balances, gems: gems, workcounts: workcounts, servers: bot.guilds.size});
    })
});

var options = {
    key: key,
    cert: certificate
};

// https.createServer(options, app).listen(443);
// http.createServer(app).listen(80);

var httpsServer = https.createServer(options, app).listen(443, function () {
    var host = httpsServer.address().address;
    var port = httpsServer.address().port;

    console.log(`EcoBot API listening at http://${host}:${port}`);
});

var httpServer = http.createServer(app).listen(80, function () {
    var host = httpServer.address().address;
    var port = httpServer.address().port;

    console.log(`EcoBot API listening at http://${host}:${port}`);
});

// var server = app.listen(443, function () {
//     var host = server.address().address;
//     var port = server.address().port;

//     console.log(`EcoBot API listening at http://${host}:${port}`);
// });