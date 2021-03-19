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

        var profile = await ProfileUtils.get(msg.author, client);

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

                profile.model.racing.selectedCarID = carItem.id;
                profile.save();

                msg.channel.send({ embed: {
                    title: `Congrats 🎉`,
                    description: `You successfully set your racing car to ${carItem.formatName} with a top speed of ${carItem.maxSpeed} mph`,
                    color: client.colors.success
                }});
                return;
            case "disable":
                profile.model.racing.selectedCarID = "None";
                profile.save();

                msg.channel.send({ embed: {
                    title: `Congrats 🎉`,
                    description: `People can no longer race you.`,
                    color: client.colors.success
                }});
                return;
            default:

                if(profile.model.racing.selectedCarID === "None") {
                    msg.channel.send({ embed: {
                        title: `Whoops 🔥`,
                        description: `You don't have a car selected! Do \`${guildPrefix}race select <car ID>\` to select one.`,
                        color: client.colors.warning
                    }});
                    return;
                };

                var opponent = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);

                if (!opponent) {
                
                    if (await profile.getCooldown("race", true, msg).response) return;

                    const [cars, notCars] = client.items.partition(i => i.category === "cars");
                    var opponentCar = cars.random();
                    var yourCar = client.items.get(profile.model.racing.selectedCarID);

                    var opponentSpeed = opponentCar.maxSpeed - Math.floor(Math.random() * 49) + 1;
                    var yourSpeed = yourCar.maxSpeed - Math.floor(Math.random() * 59) + 1;

                    if (yourSpeed > opponentSpeed) {
                        var winAmount = Math.floor((Math.random()*2500) +14999);

                        profile. addCoins(winAmount);
                        profile.save();

                        msg.channel.send({ embed: {
                            title: `Congrats 🎉`,
                            description: `You had a speed of ${yourSpeed} mph and won the race! They had a speed of ${opponentSpeed} mph and paid you ${FormatUtils.money(winAmount)}`,
                            color: client.colors.success
                        }});
                        return;
                    } else {
                        var loseAmount = Math.floor((Math.random()*2500) +9999);

                        profile.delCoins(loseAmount);
                        if (profile.getCoins() < 0) {
                            profile.getCoins() = 0;
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
                    if (opponent == msg.author) {
                        msg.channel.send({ embed: {
                            title: `Whoops 🔥`,
                            description: `You can't race yourself!`,
                            color: client.colors.warning
                        }});
                        return;
                    }

                    var opponentProfile = await ProfileUtils.get(opponent, client);

                    if(opponentProfile.model.racing.selectedCarID === "None") {
                        msg.channel.send({ embed: {
                            title: `Whoops 🔥`,
                            description: `They don't have a car selected! Do \`${guildPrefix}race select <car ID>\` to select one.`,
                            color: client.colors.warning
                        }});
                        return;
                    };
                
                    if (await profile.getCooldown("race", true, msg).response) return;   

                    var opponentCar = client.items.get(opponentProfile.model.racing.selectedCarID);
                    var yourCar = client.items.get(profile.model.racing.selectedCarID);

                    var opponentSpeed = opponentCar.maxSpeed - Math.floor(Math.random() * 49) + 1;
                    var yourSpeed = yourCar.maxSpeed - Math.floor(Math.random() * 39) + 1;

                    var crashChance = yourCar.crashChance;
                    var crash = Math.floor(Math.random() * 99);
                    var repair = yourCar.repairCost;

                    if (crashChance >= crash){
                        profile.delCoins(repair);
                        profile.save();

                        msg.channel.send({ embed: {
                            title: `Uh Oh! 💥🏎`,
                            description: ` Your ${yourCar.formatName} crashed! You lost the race and paid the repair cost of $${repair}`,
                            color: client.colors.error
                        }
                        });
                        return;
                    }
                    if (yourSpeed > opponentSpeed) {
                        var winAmount = Math.floor((Math.random()*2500) +14999);

                        if (!opponentProfile.getCoins() >= winAmount) {
                            winAmount = opponentProfile.getCoins();
                        }

                        profile.addCoins(winAmount);
                        profile.save();
                        opponentProfile.delCoins(winAmount);
                        opponentProfile.save();

                        msg.channel.send({ embed: {
                            title: `Congrats 🎉`,
                            description: `You had a speed of ${yourSpeed} mph and won the race! They had a speed of ${opponentSpeed} mph and paid you ${FormatUtils.money(winAmount)}`,
                            color: client.colors.success
                        }});
                        return;
                    } else {
                        var loseAmount = Math.floor((Math.random()*2500) +9999);

                        if (!profile.getCoins() >= loseAmount) {
                            loseAmount = profile.getCoins();
                        }

                        profile. delCoins(loseAmount);
                        profile.save();
                        opponentProfile. addCoins(loseAmount);
                        opponentProfile.save();

                        msg.channel.send({ embed: {
                            title: `Good Try... 🔥`,
                            description: `You had a speed of ${yourSpeed} mph, but they had a speed of ${opponentSpeed} mph and you lost ${FormatUtils.money(loseAmount)}`,
                            color: client.colors.warning
                        }});
                        return;
                    }

                }
        } 

    }
}