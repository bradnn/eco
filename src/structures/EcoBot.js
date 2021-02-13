const { Client, Collection } = require('discord.js');
const DBL = require("dblapi.js");
const { parse } = require('path');
const { promisify } = require('util'); 
const glob = promisify(require('glob'));

module.exports = {
    EcoBot: class extends Client {
        constructor(config, clientOptions) {
            super(config.TOKEN, clientOptions);
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
            this.aliases = new Collection();

            this._loadCommands(this);
            this._loadEvents(this);
            this._updateList(this, config);
        };

        _loadCommands (client) {
            glob (`${process.cwd()}/src/commands/**/*.js`).then(commands => {
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
            glob (`${process.cwd()}/src/events/**/*.js`).then(events => {
                for (const eventFile of events) {
                    const { name } = parse(eventFile);
                    const file = require(eventFile);
                    const event = new file(client, name.toLowerCase());
                    client.on(name, (...args) => event.run(client, ...args));
                }
            });
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
            await this.login(this.config.TOKEN);
        }
    }
}