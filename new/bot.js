require('dotenv').config();

const { Client, Collection } = require('discord.js');
const config = process.env;
const fs = require('fs');
const mongoose = require('mongoose');
const { parse } = require('path');
const { promisify } = require('util'); 
const glob = promisify(require('glob'));

const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.profiles = new Collection();
client.items = new Collection();
client.jobs = new Collection();

client.config = config;
client.logger = require('./modules/Logger');
client.colors = {
    success: 65280,
    error: 16711680,
    warning: 16758528,
    sick: 5420936,
    default: 13366256
}

async function start() {

    // Starting Events
    glob (`${process.cwd()}/new/events/**/*.js`).then(events => {
        for (const eventFile of events) {
            const { name } = parse(eventFile);
            const file = require(eventFile);
            const event = new file(client, name.toLowerCase());
            client.logger.event(`Loading Event: ${name}`);
            client.on(name, (...args) => event.run(client, ...args));
        }
    });

    // Loading Commands    
    glob (`${process.cwd()}/new/commands/**/*.js`).then(commands => {
        for (const commandFile of commands) {
            const { name } = parse(commandFile);
            const file = require(commandFile);
            const command = new file(client, name.toLowerCase());
            client.logger.command(`Loading Command: ${name}`);
            client.commands.set(name, command);
            if (command.aliases) {
                for (const alias of command.aliases) {
                    client.aliases.set(alias, name);
                }
            }
        }
    });

    // Loading Items
    glob (`${process.cwd()}/new/storage/items/**/*.js`).then(items => {
        for (const itemFile of items) {
            const { name } = parse(itemFile);
            const file = require(itemFile);
            const item = new file();
            const itemID = item.id;
            client.logger.item(`Loading Item: ${name} (${itemID})`);
            client.items.set(itemID, item);
        }
    });

    // Loading Jobs
    glob (`${process.cwd()}/new/storage/jobs/**/*.js`).then(jobs => {
        for (const jobFile of jobs) {
            const { name } = parse(jobFile);
            const file = require(jobFile);
            const job = new file();
            client.logger.job(`Loading Job: ${job.name}`);
            client.jobs.set(name, job);
        }
    });

    // Connect to Database
    await mongoose.connect(config.CANARY_MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        client.logger.mongo(`Connected to the MongoDB database.`);
    }).catch((err) => {
        client.logger.error(`Couldn't connect to the MongoDB database. Error: ${err}`);
    })

    client.login(config.CANARY_TOKEN);
}

start();

module.exports.Client = {
    get: function () {
        return client;
    }
}