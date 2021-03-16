const { Client, Collection } = require('discord.js');
const DBL = require("dblapi.js");
const { parse } = require('path');
const { promisify } = require('util'); 
const glob = promisify(require('glob'));

module.exports = {
    EcoBot: class extends Client {
        constructor(config, clientOptions, CANARY) {
            super(config, clientOptions, CANARY);
            this.CANARY = CANARY;
            this.config = config;

            this.colors = {
                success: 65280,
                error: 16711680,
                warning: 16758528,
                sick: 5420936,
                default: 13366256
            }
            
            this.commands = new Collection();
            this.events = new Collection();
            this.items = new Collection();
            this.aliases = new Collection();
            this.profiles = new Collection();

            this._loadCommands(this);
            this._loadEvents(this);
            this._loadItems(this);
            if (!this.CANARY) this._updateList(this, config);
        };

        _loadCommands (client) {
            glob (`${process.cwd()}/bot/commands/**/*.js`).then(commands => {
                for (const commandFile of commands) {
                    const { name } = parse(commandFile);
                    const file = require(commandFile);
                    const command = new file(client, name.toLowerCase());
                    client.commands.set(name, command);
                    if (command.aliases) {
                        for (const alias of command.aliases) {
                            client.aliases.set(alias, name);
                        }
                    }
                }
            });
        }

        _loadEvents (client) {
            glob (`${process.cwd()}/bot/events/**/*.js`).then(events => {
                for (const eventFile of events) {
                    const { name } = parse(eventFile);
                    const file = require(eventFile);
                    const event = new file(client, name.toLowerCase());
                    client.on(name, (...args) => event.run(client, ...args));
                }
            });
        }

        _loadItems (client) {
            glob (`${process.cwd()}/bot/resources/items/**/*.js`).then(items => {
                for (const itemFile of items) {
                    const { name } = parse(itemFile);
                    const file = require(itemFile);
                    const item = new file(client, name.toLowerCase());

                    const itemID = item.id;
                    client.items.set(itemID, item);
                }
            })
        }

        _updateList (client, config) {
            const dbl = new DBL(config.DBLApi, client);
            dbl.on('posted', () => {
                console.log(`Posted server count to Top.GG (${client.guilds.cache.size})`);
                client.user.setActivity(`;help | In ${client.guilds.cache.size} servers!`, { type: 'WATCHING' });
            });
            dbl.on('error', e => {
                console.log(`EcoBot: ERROR: ${e}`);
            });
        }

        async start() {
            if (this.CANARY) await this.login(this.config.CANARY_TOKEN);
            else await this.login(this.config.BOT_TOKEN);
        }
    }
}