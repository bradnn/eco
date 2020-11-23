const { CooldownUtils } = require("../../utils/cooldown");
const { JobUtils } = require("../../utils/job");
const { TimeUtils } = require("../../utils/time");
const { UserUtils } = require("../../utils/user");

const cooldowns = {
    work: 60000,
    crime: 60000,
    apply: 900000,
    pay: 3600000,
    flip: 15000
};

module.exports.CooldownHandlers = {
    generateEmbed: function (username, type, remaining) {
        const embed = {
            embed: {
                author: {
                    name: `Calm down ${username}.`
                },
                description: `Give it some time before you ${type} again! Remaining: ${remaining}`,
                color: 16664648
            }
        }

        return embed;
    },
    set: async function (type, user) {
        let userProfile = await UserUtils.get(user.id);
        let userCooldowns = userProfile.cooldowns;
        var cooldown = cooldowns[type];

        const previousTime = userCooldowns[type];
        const nowTime = new Date();
        const timePassed = Math.abs(previousTime - nowTime);

        const timeLeftMs = Math.ceil((cooldown - timePassed));
        if (timeLeftMs < 0) {
            return 0;
        } else {
            return timeLeftMs;
        }
    },
    get: async function (type, user, set) {
        if (!type) {
            return {
                response: false
            };
        }
        if (!user) {
            console.error("Missing Arguments (ON_COOLDOWN)");
            return null;
        }
        let userProfile = await UserUtils.get(user.id);
        let userCooldowns = userProfile.cooldowns;
        if(type == "work" && userProfile.work.sick == true) {
            JobUtils.sick(user.id);
            var cooldown = cooldowns[type] * 10;
        } else {
            var cooldown = cooldowns[type];
        }

        const previousTime = userCooldowns[type];
        const nowTime = new Date();
        const timePassed = Math.abs(previousTime - nowTime);

        if (timePassed < cooldown) {

            const timeLeftMs = Math.ceil((cooldown - timePassed));
            const timeLeftSec = (timeLeftMs / 1000);
            const timeLeftFormatted = TimeUtils.msToTime(timeLeftMs);

            return {
                response: true,
                timeLeftSec: timeLeftSec,
                timeLeftMs: timeLeftMs,
                timeLeftFormatted: timeLeftFormatted,
                message: `${type} is on cooldown! ${timeLeftFormatted} remaining until you can perform ${type}`,
                embed: this.generateEmbed(user.username, type, timeLeftFormatted)
            };
        }

        if(!set || set == true) {
            await CooldownUtils.set(user.id, type, nowTime);
        }
        return {
            response: false
        };
    }
}