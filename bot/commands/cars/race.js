const { JobList } = require("../../structures/models/Jobs");
const { collection } = require("../../structures/models/User");
const { CooldownHandlers } = require("../../utils/cooldown/handler");
const { FormatUtils } = require("../../utils/format/format");
const { ProfileUtils } = require("../../utils/profile/profile");

module.exports = class {
    constructor() {
        this.cmd = 'race',
        this.aliases = ['racecars']
    }

    async run(client, msg, args, guildPrefix) {

        var profile = await ProfileUtils.get(msg.author.id);

        switch (args[0]) {
            case "s":
            case "select":

                var selectedCar = args[1].toUpperCase();
                var carItem = client.items.get(selectedCar);

                console.log(carItem);

                if(carItem == null || carItem.category != 'cars') {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `Please supply a valid car ID to select.`,
                        color: client.colors.warning
                    }});
                    return;
                }

                profile.racing.selectedCarID = carItem.id;
                profile.save();

                msg.channel.send({ embed: {
                    title: `Congrats 🎉`,
                    description: `You successfully set your racing car to ${carItem.formatName} with a top speed of ${carItem.maxSpeed} mph`,
                    color: client.colors.success
                }});
                return;
            case "disable":
                profile.racing.selectedCarID = "None";
                profile.save();

                msg.channel.send({ embed: {
                    title: `Congrats 🎉`,
                    description: `People can no longer race you.`,
                    color: client.colors.success
                }});
                return;
            default:

                if(profile.racing.selectedCarID === "None") {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `You don't have a car selected! Do \`${guildPrefix}race select <car ID>\` to select one.`,
                        color: client.colors.warning
                    }});
                    return;
                };

                var opponent = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

                if (!opponent) {
                
                    const cooldown = await CooldownHandlers.get("race", msg.author);
                    if (cooldown.response) {
                        msg.channel.send(cooldown.embed);
                        return;
                    }

                    const [cars, notCars] = client.items.partition(i => i.category === "cars");
                    var opponentCar = cars.random();
                    var yourCar = client.items.get(profile.racing.selectedCarID);

                    var opponentSpeed = opponentCar.maxSpeed - Math.floor(Math.random() * 49) + 1;
                    var yourSpeed = yourCar.maxSpeed - Math.floor(Math.random() * 59) + 1;

                    if (yourSpeed > opponentSpeed) {
                        var winAmount = Math.floor((Math.random()*2500) +14999);

                        profile.econ.wallet.balance += winAmount;
                        profile.save();

                        msg.channel.send({ embed: {
                            title: `Congrats 🎉`,
                            description: `You had a speed of ${yourSpeed} mph and won the race! They had a speed of ${opponentSpeed} mph and paid you ${FormatUtils.money(winAmount)}`,
                            color: client.colors.success
                        }});
                        return;
                    } else {
                        var loseAmount = Math.floor((Math.random()*2500) +9999);

                        profile.econ.wallet.balance -= loseAmount;
                        if (profile.econ.wallet.balance < 0) {
                            profile.econ.wallet.balance = 0;
                        }
                        profile.save();

                        msg.channel.send({ embed: {
                            title: `Good Try... 🔥`,
                            description: `You had a speed of ${yourSpeed} mph, but they had a speed of ${opponentSpeed} mph and you lost ${FormatUtils.money(loseAmount)}`,
                            color: client.colors.warning
                        }});
                        return;
                    }

                } else {
                    var opponentProfile = await ProfileUtils.get(opponent.id);

                    if(opponentProfile.racing.selectedCarID === "None") {
                        msg.channel.send({ embed: {
                            title: `Whoops 🔥`,
                            description: `They don't have a car selected! Do \`${guildPrefix}race select <car ID>\` to select one.`,
                            color: client.colors.warning
                        }});
                        return;
                    };
                
                const cooldown = await CooldownHandlers.get("race", msg.author);
                if (cooldown.response) {
                    msg.channel.send(cooldown.embed);
                    return;
                }

                    var opponentCar = client.items.get(opponentProfile.racing.selectedCarID);
                    var yourCar = client.items.get(profile.racing.selectedCarID);

                    var opponentSpeed = opponentCar.maxSpeed - Math.floor(Math.random() * 49) + 1;
                    var yourSpeed = yourCar.maxSpeed - Math.floor(Math.random() * 39) + 1;

                    if (yourSpeed > opponentSpeed) {
                        var winAmount = Math.floor((Math.random()*2500) +14999);

                        if (!opponentProfile.econ.wallet.balance >= winAmount) {
                            winAmount = opponentProfile.econ.wallet.balance;
                        }

                        profile.econ.wallet.balance += winAmount;
                        profile.save();
                        opponentProfile.econ.wallet.balance -= winAmount;
                        opponentProfile.save();

                        msg.channel.send({ embed: {
                            title: `Congrats 🎉`,
                            description: `You had a speed of ${yourSpeed} mph and won the race! They had a speed of ${opponentSpeed} mph and paid you ${FormatUtils.money(winAmount)}`,
                            color: client.colors.success
                        }});
                        return;
                    } else {
                        var loseAmount = Math.floor((Math.random()*2500) +9999);

                        if (!profile.econ.wallet.balance >= loseAmount) {
                            loseAmount = profile.econ.wallet.balance;
                        }

                        profile.econ.wallet.balance -= loseAmount;
                        profile.save();
                        opponentProfile.econ.wallet.balance += loseAmount;
                        opponentProfile.save();

                        msg.channel.send({ embed: {
                            title: `Good Try... 🔥`,
                            description: `You had a speed of ${yourSpeed} mph, but they had a speed of ${opponentSpeed} mph and you lost ${FormatUtils.money(loseAmount)}`,
                            color: client.colors.warning
                        }});
                        return;
                    }

                }

                break;
        } 

    }
}