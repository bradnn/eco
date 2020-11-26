const { EcoBot } = require('./structures/EcoBot.js');
const Config = require('../config-alpha.js');

const mongoose = require('mongoose');
mongoose.connect(Config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const client = new EcoBot(Config, { disableEveryone: true });

client.connect();