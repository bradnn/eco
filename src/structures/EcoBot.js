const Eris = require('eris');
require('eris-additions')(Eris, { enabled: ["Channel.awaitMessages"]});
const { parse } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = {
    EcoBot: class extends Eris.Client {
        constructor(config, clientOptions) {
            super(config.TOKEN, clientOptions);
            this.config = config;
            
            this.commands = new Eris.Collection();
            this.events = new Eris.Collection();
            this.aliases = new Eris.Collection();

            this._loadCommands(this);
            this._loadEvents(this);
        };

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