const Eris = require('eris');
require('eris-additions')(Eris, { enabled: ["Channel.awaitMessages"]});
const { parse } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const DBL = require("dblapi.js");
var DonateBotAPI = require('donatebot-node-api');

module.exports = {
    EcoBot: class extends Eris.Client {
        constructor(config, clientOptions) {
            super(config.TOKEN, clientOptions);
            this.config = config;
            
            this.commands = new Eris.Collection();
            this.events = new Eris.Collection();
            this.aliases = new Eris.Collection();

            this.donateApi = new DonateBotAPI({
                serverID: "750142770559189053",
                apiKey: this.config.donateBot
            });

            this._loadCommands(this);
            this._loadEvents(this);
            this._loadDBL(this, this.config);
        };

        _loadDBL(client, config) {
            const dbl = new DBL(config.DBLApi, client);
            dbl.on('posted', () => {
                console.log(`Posted server count to Top.GG`);
            });
            dbl.on('error', e => {
                console.log(`EcoBot: ERROR: ${e}`);
            });
        }

        _loadCommands(client) {
            glob(`${process.cwd()}/src/commands/**/*.js`).then(commands => {
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

        _loadEvents(client) {
            glob(`${process.cwd()}/src/events/**/*.js`).then(events => {
                for (const eventFile of events) {
                    const { name } = parse(eventFile);
                    const file = require(eventFile);
                    const event = new file(client, name.toLowerCase());
                    client.on(name, (...args) => event.run(client, ...args));
                }
            });
        }

    }
}