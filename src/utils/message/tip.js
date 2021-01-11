module.exports.TipUtils = {
    embedTip: function (embed, prefix) {
        var tips = [`Want 1,000 free gems? Get some by voting for our bot by doing ${prefix}vote!`, `Don't understand something? Check out the ${prefix}help command!`, `If you need help check out our support server in ${prefix}help!`, `Join our community & support server for frequent giveaways! ${prefix}help!`];
        
        var tip = Math.floor(Math.random() * tips.length);

        embed.footer = {
            text: tips[tip]
        }

        return embed;
    
    }
}