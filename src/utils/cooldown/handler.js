const { FormatUtils } = require("../format/format");
const { ProfileUtils } = require("../profile/profile");

const cooldowns = {
    work: 20000,
    mine: 120000,
    crime: 60000,
    rob: 60000,
    robUser: 300000,
    race: 150000,
    apply: 600000,
    pay: 3600000, 
    flip: 15000,
    hunt: 90000
};

module.exports.CooldownHandlers = {
    generateEmbed: function (username, type, remaining) {

        var formattedType = type.charAt(0).toUpperCase() + type.slice(1);

        const embed = {
            embed: {
                title: `Slow down ${username} ⏱`,
                description: `${formattedType} is on cooldown! Please wait ${remaining}.`,
                color: 16758528
            }
        }

        return embed;
    },
    get: async function (type, user, set) {
        if (!type) {
            return {
                response: false
            };
        }
        if(!user) {
            console.log("(COOLDOWN) Missing Argument: USER_MODEL");
            return null;
        }

        let profile = await ProfileUtils.get(user.id);
        let userCooldowns = profile.cooldowns;
        if (type == "work" && profile.work.sick) {
            var cooldown = cooldowns[type] * 20;
        } else {
            var cooldown = cooldowns[type];
        }
        const previousTime = userCooldowns[type];
        const nowTime = new Date();
        const timePassed = Math.abs(previousTime - nowTime);

        if (timePassed < cooldown) {
            const timeLeftMs = Math.ceil(cooldown - timePassed);
            const timeLeftSec = (timeLeftMs / 1000);
            const timeLeftFormatted = FormatUtils.time(timeLeftMs);

            return {
                response: true,
                timeLeftSec: timeLeftSec,
                timeLeftMs: timeLeftMs,
                timeLeftFormatted: timeLeftFormatted,
                message: `${type} is on cooldown! ${timeLeftFormatted} remaining until you can perform ${type}`,
                embed: this.generateEmbed(user.username, type, timeLeftFormatted)
            }
        }

        if(profile.work.sick == true) {
            profile.work.sick = false;
        }

        if(!set || set == true) {
            profile.cooldowns[type] = nowTime;
        }
        profile.save();
        return {
            response: false
        };

    },
    getMsLeft: async function (type, user) {
        let profile = await ProfileUtils.get(user.id);
        let userCooldowns = profile.cooldowns;
        var cooldown = cooldowns[type];
        const previousTime = userCooldowns[type];
        const nowTime = new Date();
        const timePassed = Math.abs(previousTime - nowTime);
        const timeLeftMs = Math.ceil(cooldown - timePassed);

        if (timeLeftMs < 0) {
            return 0;
        } else {
            return timeLeftMs;
        }
    }
}