const { ProfileUtils } = require("../../../bot/utils/profile/profile");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'additem',
        this.aliases = ['additem']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        const staff = ['767877736739242025'];

        if (!staff.includes(msg.author.id)) {
            msg.channel.send(`You aren't a staff member.`);
            return;
        }
        var author = msg.author;
        var user = options.author;

        var itemId = args[0];
        var item = client.items.get(itemId);
        if (!item) {
            msg.channel.send(`Item doesn't exist`);
            return;
        }

        if(args[1]) {
            author = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
            user = await User.get(author);
        } 
        user.addItem(item.id);
        user.save();
        msg.channel.send(`Added ${item.name} (${item.id}) to user ${author.username}.`);
    }
}