const { EcoBot } = require('./structures/EcoBot.js');
require('dotenv').config();
const mongoose = require('mongoose');

const CANARY = true; // CHANGE THIS TO LAUNCH CANARY OR NORMAL

if (CANARY) mongoose.connect(process.env.CANARY_MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true});
if (!CANARY) mongoose.connect(process.env.BOT_MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true});

const client = new EcoBot(process.env, { disableEveryone: true}, CANARY);

client.start();