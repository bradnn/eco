const { User } = require("../../modules/User")

module.exports = class {
    constructor() {
        this.cmd = 'apply',
        this.aliases = ['applyfor']
        this.unlockLevel = 0;
    }

    async run(client, msg, args, options) {
        var message = ``;
        var user = options.author;
        var job = args[0];
        if (!job) {
            var array = client.jobs.array().sort((a, b) => {return a.pay - b.pay});
            for (var item of array) {
                if (item.name == "Begger") continue;
                if(item.workRequirement > user.getWorkCount()) break;
                message += `${item.name} **-** $${item.pay} (${item.workRequirement} times)\n`
            }
    
            msg.channel.send({embed: {
                title: `Current Jobs 👷‍♂️`,
                description: `__Job Name **-** Payrate (Work Requirement)__\n\n${message}`
            }});
        } else {
            job = client.jobs.get(job.toLowerCase());
            if (!job) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `That isn't a valid job! Do \`${options.prefix}apply\` to see a list of available jobs!`,
                    color: client.colors.warning
                }});
                return;
            }

            if (job.workRequirement > user.getWorkCount()) {
                msg.channel.send({ embed: {
                    title: `Whoops 🔥`,
                    description: `You can't apply for this job! Do \`${options.prefix}apply\` to see a list of available jobs!`,
                    color: client.colors.warning
                }});
                return;
            }
            if (user.getCooldown("apply", true, msg).response) return;

            user.setJob(job.name) ;
            user.save();
            msg.channel.send({ embed: {
                title: `Congrats 🎉`,
                description: `You were accepted as a ${job.name}! Congrats on your new job.`,
                color: client.colors.success
            }});
            return;
        }
    }
}