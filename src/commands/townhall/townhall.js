const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");
const { townHallUtils } = require("../../utils/townhall/townhall")

module.exports = class {
    constructor() {
        this.cmd = 'townhall',
        this.aliases = ['th', 'hall']
    }

    async run(client, msg, args, prefix) {
        var subCommand = args[0];

        if(!subCommand) {
            info(client, msg, args, prefix);
            return;
        }

        switch (subCommand) {
            case "info":
                info(client, msg, args, prefix);
                break;
            case "ul":
            case "unlocks":
                unlocks(client, msg, args, prefix);
                break;
            case "dp":
            case "dep":
            case "deposit":
                deposit(client, msg, args, prefix);
                break;
        }

        async function info (client, msg, args, prefix) {
            var profile = await ProfileUtils.get(msg.author);

            var embed = {
                title: `Town Hall 🔔`,
                fields: [
                    {
                        name: `Your Deposits`,
                        value: `💷 Amount **-** ${FormatUtils.money(profile.econ.wallet.balance)}`
                    }
                ],
                color: client.colors.default,
                footer: {
                    text: `Do ${prefix}townhall deposit <amount> to contribute!`
                }
            }

            msg.channel.send({embed: embed});
            return;
        }
        function unlocks ( client, msg, args, prefix) {
            var embed = {
                title: `Town Hall 🔔`,
                fields: [
                    {
                        name: `Deposit Unlocks`,
                        value: `$2.5M **-** Unlocks Crimes
$10M **-** Unlocks DarkNet`
                    }
                ],
                color: client.colors.default,
                footer: {
                    text: `Do ${prefix}townhall deposit <amount>\` to contribute!`
                }
            }

            msg.channel.send({embed: embed});
        }

        async function deposit (client, msg, args, prefix) {
            var user = msg.author;
            var profile = await ProfileUtils.get(user.id);
            var amount = parseInt(args[1]);

            if (isNaN(amount) || !amount) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `Please provide a valid number!`,
                    color: client.colors.warning
                }});
                return;
            } else if (amount > profile.econ.wallet.balance || amount <= 0 || profile.econ.wallet.balance == 0) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You don't have enough to deposit!`,
                    color: client.colors.warning
                }});
                return;
            }

            var townHall = await townHallUtils.get();

            townHall.deposits.total += amount;

            profile.econ.wallet.balance -= amount;
            profile.stats.townhall.depositAmount += amount;

            townHall.save();
            profile.save();

            msg.channel.send({ embed: {
                title: `Money Transfered 🏦`,
                description: `You just deposited $${FormatUtils.numberLetter(amount)} to the town hall bank!`,
                color: client.colors.success
            }});
            return;


        }

    }
}