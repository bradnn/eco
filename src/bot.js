const { EcoBot } = require('./structures/EcoBot.js');
const mongoose = require('mongoose');
const Config = require('../config.js');

mongoose.connect(Config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new EcoBot(Config, { disableEveryone: true, restMode: true });

client.connect();