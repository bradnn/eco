const { RequestHandler } = require("eris");
const { Challenge } = require("../../modules/Challenge");
const { Number } = require("../../modules/Number");
const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'blackjack',
        this.aliases = ['bj']
        this.unlockLevel = 5; // 10
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
        } else if (amount > 500000) {
            msg.channel.send({ embed: {
                title: `Whoops 🔥`,
                description: `You can't gamble more than $500,000 at once!`,
                color: client.colors.warning
            }});
            return;
        }

        const suits = ['♥', '♦', '♣', '♠'],
              cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        var dealer = [],
            dealerAces = 0,
            player = [],
            playerAces = 0

        function drawCard(type = "player") {
            const randomCardIndex = Math.floor(Math.random() * cardValues.length);
            const randomSuitIndex = Math.floor(Math.random() * suits.length);
            var value;
            if (type == "dealer") {
                value = randomCardIndex + 1;
                if (randomCardIndex == 0) { value = 11; dealerAces += 1;};
                if (randomCardIndex > 9) { value = 10; };
                dealer.push({
                    card: cardValues[randomCardIndex],
                    suit: suits[randomSuitIndex],
                    value
                });
            } else {
                value = randomCardIndex + 1;
                if (randomCardIndex == 0) { value = 11; playerAces += 1;};
                if (randomCardIndex > 9) { value = 10; };
                player.push({
                    card: cardValues[randomCardIndex],
                    suit: suits[randomSuitIndex],
                    value
                });
            }
        }

        function getHandString(array) {
            var string = ``;
            for (var x = 0; x < array.length; x++) {
                string += `\`${array[x].card}${array[x].suit}\` `
            }
            return string;
        }

        function getHandValue(array) {
            var amt = 0;
            var aces = 0;
            for (var x = 0; x < array.length; x++) {
                if (array[x].value === 11) { aces++; };
                amt += array[x].value;
            }
            if (amt > 21 && aces > 0) { amt -= 10 };
            return amt;
        }

        drawCard();
        drawCard();
        drawCard("dealer");

        const hitOrStandFilter = response => {
            if (response.author.id !== msg.author.id) { return false }; 
            var thisResponse = response.content.toLowerCase();
            if (thisResponse === "hit" || thisResponse === "stand") { return true };
        }

        async function hitOrStand() {
            await msg.channel.send(`Type \`hit\` to hit or \`stand\` to stand`, {embed: {
                title: `BlackJack Game`,
                fields: [
                    {
                        name: `Your Hand`,
                        value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                    },
                    {
                        name: `Dealers Hand`,
                        value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                    }
                ]
            }}).then(async () => {
                await msg.channel.awaitMessages(hitOrStandFilter, {max: 1, time: 30000, errors: ['time']})
                .then(collected => {
                    switch (collected.first().content.toLowerCase()) {
                        case "hit": {
                            drawCard();

                            var handValue = getHandValue(player);

                            if (handValue > 21) {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**LOST**) ❌`,
                                    description: `You busted...`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ],
                                    color: client.colors.error
                                }});
                                user.delCoins(amount);
                                user.save();
                                return;
                            } else if (handValue == 21) {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**WON**) ✔`,
                                    description: `You got a blackjack!`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ],
                                    color: client.colors.success
                                }});
                                user.addCoins(amount);
                                user.save();
                                return;
                            }

                            hitOrStand();
                            return;
                        }
                        case "stand": {
                            while (getHandValue(dealer) < 17) {
                                drawCard("dealer");
                            }
                            var dealerValue = getHandValue(dealer);
                            var playerValue = getHandValue(player);
                            if (dealerValue > 21) {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**WON**) ✔`,
                                    description: `The dealer busted and you won.`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ],
                                    color: client.colors.success
                                }});
                                user.addCoins(amount);
                                user.save();
                                return;
                            } else if (dealerValue == playerValue) {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**TIE**)`,
                                    description: `You had equal cards and you kept your money`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ]
                                }});
                                return;
                            } else if (dealerValue < playerValue) {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**WON**) ✔`,
                                    description: `You were higher than the dealer!`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ],
                                    color: client.colors.success
                                }});
                                user.addCoins(amount);
                                user.save();
                                return;
                            } else {
                                msg.channel.send({embed: {
                                    title: `BlackJack Game (**LOST**) ❌`,
                                    description: `The dealer had better cards than you...`,
                                    fields: [
                                        {
                                            name: `Your Hand`,
                                            value: `${getHandString(player)}\nValue: ${getHandValue(player)}`
                                        },
                                        {
                                            name: `Dealers Hand`,
                                            value: `${getHandString(dealer)}\nValue: ${getHandValue(dealer)}`
                                        }
                                    ],
                                    color: client.colors.error
                                }});
                                user.delCoins(amount);
                                user.save();
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

        await hitOrStand();
        



    }
}