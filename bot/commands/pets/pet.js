const { JobList } = require("../../structures/models/Jobs");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'pet',
        this.aliases = ['petinfo']
    }

    async run(client, msg, args, guildPrefix) {

        var subCommand = args[0].toLowerCase();

        switch(subCommand) {
            default:
                break;
            case "help":
                break;
            case "level":
                break;
        }
    }
}