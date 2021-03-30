const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'addcoins',
        this.aliases = ['addcoins']
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

        if(args[1]) {
            author = msg.mentions.users.first() || msg.guild.members.cache.get(args[1]);
            user = await User.get(author);
        } 
        var amount = parseInt(args[0]);
        if(!amount || isNaN(amount)) {
            msg.channel.send(`Please provide a valid amount.`);
        }

        user.addCoins(amount);
        user.save();
        msg.channel.send(`Added ${amount} coins to user ${author.username}.`);
    }
}