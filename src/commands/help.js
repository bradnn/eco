module.exports = class {
    constructor() {
        this.cmd = 'help',
        this.aliases = ['what']
    }

    async run(client, msg, args, prefix) {
        msg.channel.createMessage({embed: {
            title: `EcoBot Help Menu`,
            description: `Check out our [github](https://github.com/sycles/EcoBot) for more information!
Join our support server [here](https://discord.gg/NNXGg4mZQB).
Invite the bot to another server [here](https://discord.com/api/oauth2/authorize?client_id=776935174222249995&permissions=8&scope=bot)`,
            fields: [
                {
                    name: `Getting Started`,
                    value: `❗ __Information__
To get started as a new player you will need to apply for a job using the \`;apply\` command. Doing \`;apply\` without any arguments will give you a list of available jobs. To apply for a job  you have access to do \`;apply <name>.\`
After receiving your first job, you can do ;work to get money and after 15 times using the command you can access the next job!`,
                    inline: false
                },
                {
                    name: `Working Help`,
                    value: `❗ __Commands__
${prefix}apply **-** Apply for a job.
${prefix}work **-** Work and get money in return
${prefix}stats **-** See your working stats
❗ __Information__
The more you work the better jobs you can get!
Every 25 times you work you will recieve a raise that will be reset when you apply for a new job.
You also have a 2% chance to get fired from your job when you work.`,
                    inline: true
                },
                {
                    name: `Profile Help`,
                    value: `❗ __Commands__
${prefix}profile **-** Shows your balance and job information.
${prefix}pay <user> <amount> **-** Send someone money out of your balance
${prefix}baltop **-** Shows the top 10 money balances.
${prefix}gemtop **-** Shows the top 10 gem balances.
❗ __Information__
Your profile shows a brief overview on where you are at.
Paying is limited to once an hour with a maximum of $100,000 to prevent boosting.`,
                    inline: true
                },
                {
                    name: `Auction Help`,
                    value: `❗ __Commands__
${prefix}auction **-** Displays the auction menu.
${prefix}auction bid <first|second> **-** Bid on the first or second auction.
❗ __Information__
Auctions are a good way to spend your money and get rare collectables.
Items won from auctions will boost your networth and can be used in trading.
Auctions are per server, so every server will have different auctions!`,
                    inline: true
                },
                {
                    name: `Town Hall Help`,
                    value: `❗ __Commands__
${prefix}townhall **-** Displays stats on the townhall.
${prefix}townhall deposit <amount> **-** Deposit money to the townhall to unlock new things!
❗ __Information__
Contributing to the townhall will unlock new features and new ways to make money!`,
                    inline: true
                },
                {
                    name: `Crime Help`,
                    value: `❗ __Commands__
${prefix}crime **-** Commit a crime in one of four different ways.
❗ __Information__
Commiting crimes is a gamble that can pay you a lot or make you loose a lot.`,
                    inline: true
                },
                {
                    name: `Gambling Help`,
                    value: `❗ __Commands__
${prefix}flip <amount> **-** Flip your money to either double it or loose it all
❗ __Information__
Dont waste all your money!`,
                    inline: true
                },
                {
                    name: `NEED MORE HELP?`,
                    value: `Join our support server! [CLICK HERE](https://discord.gg/kvphct3TfY)`,
                    inline: false
                }
            ]
        }})
        return;
    }
}