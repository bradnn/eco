const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'bomb',
        this.aliases = ['bombs']
        this.unlockLevel = 5;
    }

    async run(client, msg, args, options) {

        const user = options.author;
        const amount = parseInt(args[0]);

        if (!amount || isNaN(amount) || amount < 0) {
            msg.channel.send({embed: {
                title: `Whoops 🔥`,
                description: `Please supply a valid amount of money!`,
                color: client.colors.warning
            }});
            return;
        }

        if (user.getCoins() < amount) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You don't have enough money for this!`,
                color: client.colors.warning
            }});
            return;
        } else if (amount > 100000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't gamble more than $100,000 at once!`,
                color: client.colors.warning
            }});
            return;
        }

        var slots = [], bombs = 0, lastBomb = 0, currentWinnings = 0, revealedSlots = [];

        for (var i = 0; i < 16; i++) {
            var percent = Math.round(Math.random() * 30) / 100;
            slots.push(percent);
        }
        
        while (bombs < 5) {
            var bombSlot = Math.floor(Math.random() * slots.length);
            while (bombSlot == lastBomb) {
                bombSlot = Math.floor(Math.random() * slots.length);
            }
            slots[bombSlot] = 0;
            lastBomb = bombSlot;
            bombs++;
        }

        const slotFilter = response => {
            if (response.author.id !== msg.author.id) { return false }; 
            var thisResponse = response.content.toLowerCase();
            if (thisResponse === "cash") { return true };
            thisResponse = parseInt(thisResponse);
            if (isNaN(thisResponse)) { return false };
            if (thisResponse > 16 || thisResponse < 1) { return false };
            return true;
        }

        var message;

        await msg.channel.send(`Starting game...`).then((m) => {
            message = m;
        });

        async function askForSlot(errormsg = ``, end = false) {
            var gameString = ``;
            for (var x = 0; x < 16; x++) {
                var string;
                if (!revealedSlots.includes(x)) {
                    string = `\`${x + 1}\` `;
                } else {
                    string = `\`${slots[x]}x\` `;
                }
                const remainder = (x + 1) % 4;
                if (remainder == 0) {
                    string += `\n`;
                }
                gameString += string;
            }

            if (end) {
                await message.edit(` `, { embed: {
                    title: `Mines 💣`,
                    description: `Type a slot 1-16. If that slot has a bomb you bust and lose your money, however if it isnt a bomb your money is multiplied.\n Type \`cash\` to cash out.\n\n${errormsg}`,
                    fields: [
                        {
                            name: `Game Field`,
                            value: gameString
                        }
                    ]
            }})
            return;
            }
            await message.edit(` `, { embed: {
                title: `Mines 💣`,
                description: `Type a slot 1-16. If that slot has a bomb you bust and lose your money, however if it isnt a bomb your money is multiplied.\n Type \`cash\` to cash out.\n\n${errormsg}`,
                fields: [
                    {
                        name: `Game Field`,
                        value: gameString
                    }
                ]
        }}).then(async (m) => {
                await msg.channel.awaitMessages(slotFilter, {max: 1, time: 120000, errors: ['time']})
                .then(collected => {
                    collected.first().delete();
                    switch (collected.first().content.toLowerCase()) {
                        case "cash": {
                            m.edit({ embed: {
                                title: `Mines 💣`,
                                description: `You cashed out with a multiplier of ${currentWinnings + 1} and won ${Math.floor((currentWinnings + 1) * amount)}`,
                                color: client.colors.success
                            }});
                            user.addCoins(Math.floor((currentWinnings + 1) * amount));
                            return;
                        }
                        default: {
                            var slot = parseInt(collected.first().content.toLowerCase()) - 1;

                            if (revealedSlots.includes(slot)) {
                                askForSlot(`❌ You already chose this slot!`);
                                return;
                            }
                            if (slots[slot] == 0) {
                                askForSlot(`❌ You hit a bomb and bust! You lost your bet.`, true);
                                user.delCoins(amount);
                                return;
                            } else {
                                currentWinnings += slots[slot];
                                revealedSlots.push(slot);
                                askForSlot(`That slot wasnt a bomb! +${(slots[slot] + 1).toFixed(2)}x`);
                                return;
                            }
                        }
                    }
                })
                .catch(collected => {
                    return;
                })
            })
        }

        askForSlot();

    }
}