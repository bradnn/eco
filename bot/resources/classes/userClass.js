const { JobList } = require('../../structures/models/Jobs.js');
const userModel = require('../../structures/models/User.js');
const { FormatUtils } = require('../../utils/format/format.js');

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
    hunt: 90000,
    paint: 115000
};

module.exports = class {
    constructor(model, user) {

        this.user = user;
        this.userID = user.id;

        this.model = model;
    }

    // ==================================================================================
    // COIN MANAGEMENT
    // ==================================================================================

    addCoins(amount) {
        amount = parseInt(amount);
        this.model.econ.wallet.balance += amount;
        if (this.model.econ.wallet.balance < 0) this.model.econ.wallet.balance = 0;
        return;
    }

    delCoins(amount) {
        this.model.econ.wallet.balance -= amount;
        if (this.model.econ.wallet.balance < 0) this.model.econ.wallet.balance = 0;
        return;
    }

    getCoins() {
        return this.model.econ.wallet.balance;
    }

    // ==================================================================================
    // GEM MANAGEMENT
    // ==================================================================================

    addGems(amount) {
        this.model.econ.wallet.gems += amount;
        if (this.model.econ.wallet.gems < 0) this.model.econ.wallet.gems = 0;
    }

    delGems(amount) {
        this.model.econ.wallet.gems -= amount;
        if (this.model.econ.wallet.gems < 0) this.model.econ.wallet.gems = 0;
    }

    getGems() {
        return this.model.econ.wallet.gems;
    }

    // ==================================================================================
    // WORK MANAGEMENT
    // ==================================================================================

    getJob() {
        return this.model.work.job;
    }

    setJob(job) {
        this.model.work.job = job;
        return true;
    }

    getPay(perfect = false, add = true) {

        const JOB_PAY = JobList.pay[this.model.work.job];
        const RAISE_BONUS = this.model.work.raiseLevel / 100;
        
        var FINAL_BONUS = RAISE_BONUS;
        if (perfect == true) FINAL_BONUS += 0.5

        const PAYOUT = Math.floor(JOB_PAY * 1 + FINAL_BONUS);
        if (add) this.addCoins(PAYOUT);
        return PAYOUT;
    }

    getSick() {
        return this.model.work.sick;
    }

    setSick(bool) {
        this.model.work.sick = bool;
        return bool;
    }

    getRaise() {
        if (this.model.stats.work.workCountRaise >= 25) {
            this.model.stats.work.workCountRaise = 0;
            this.model.work.raiseLevel++;
            return {
                levelUp: true,
                newRaise: this.model.work.raiseLevel
            };
        }
        return {
            levelUp: false,
            newRaise: this.model.work.raiseLevel
        };
    }

    setRaise(level) {
        this.model.stats.work.workCountRaise = 0;
        this.model.work.raiseLevel = level;
        return this.model.work.raiseLevel;
    }

    resetRaise() {
        this.model.work.raiseLevel = 0;
        this.model.stats.work.workCountRaise = 0;
        return true;
    }

    addWork() {
        this.model.stats.work.workCountRaise++;
        this.model.work.workCount++;
    }

    getWorkCount() {
        return this.model.stats.work.workCount;
    }

    // ==================================================================================
    // MINING MANAGEMENT
    // ==================================================================================

    getMineCount() {
        return this.model.stats.mining.timesMined;
    }
    
    addMineCount() {
        this.model.stats.mining.timesMined += 1;
        return;
    }

    // ==================================================================================
    // VOTE MANAGEMENT
    // ==================================================================================

    getVoteCount() {
        return this.model.stats.votes.voteCount;
    }

    // ==================================================================================
    // TOWN HALL MANAGEMENT
    // ==================================================================================

    getTownHallDeposited() {
        return this.model.stats.townhall.depositAmount;
    }

    addTownHallDeposit(amount = 0) {
        this.model.stats.townhall.depositAmount += amount;
        return;
    }

    // ==================================================================================
    // COOLDOWN MANAGEMENT
    // ==================================================================================

    getCooldown(type, set = true, msg) {
        const previousTime = this.model.cooldowns[type]; // When command was last used
        const nowTime = new Date(); //
        const timePassed = Math.abs(previousTime - nowTime);

        var cooldown = cooldowns[type];

        if (type == "work" && this.getSick()) cooldown = 600000;

        if (timePassed < cooldown) {
            const timeLeftMs = Math.ceil(cooldown - timePassed);
            const timeLeftSec = (timeLeftMs / 1000);
            const timeLeftFormatted = FormatUtils.time(timeLeftMs);

            if (msg) msg.channel.send(this.generateCooldownEmbed(this.user, type, timeLeftFormatted)); 

            return {
                response: true,
                timeLeftSec: timeLeftSec,
                timeLeftMs: timeLeftMs,
                timeLeftFormatted: timeLeftFormatted,
                message: `${type} is on cooldown! ${timeLeftFormatted} remaining until you can perform ${type}`,
                embed: this.generateCooldownEmbed(this.user, type, timeLeftFormatted)
            }
        }

        if (this.getSick()) this.setSick(false);
        if (set) this.setCooldown(type);
        return {
            response: false
        };
    }

    setCooldown(type) {
        this.model.cooldowns[type] = new Date();
        return true;
    }

    // ==================================================================================
    // COLLECTION MANAGEMENT
    // ==================================================================================

    getCollections() {
        return this.model.collections;
    }

    getCars() {
        return this.model.collections.cars;
    }

    async getItem(client, itemID) {
        return await client.items.get(itemID).get(this.userID);
    }

    async addItem(client, itemID, amount = 1) {
        var itemObj = await client.items.get(itemID);
        this.model.collections[itemObj.category][itemObj.name] += amount;
        return;
    }

    async delItem(client, itemID, amount = 1) {
        var itemObj = await client.items.get(itemID);
        this.model.collections[itemObj.category][itemObj.name] -= amount;
        return;
    }

    // ==================================================================================
    // EMBED GENERATORS
    // ==================================================================================

    generateCooldownEmbed(user, type, remaining) {
        var formattedType = type.charAt(0).toUpperCase() + type.slice(1);

        const embed = {
            embed: {
                title: `Slow down ${user.username} ⏱`,
                description: `${formattedType} is on cooldown! Please wait ${remaining}.`,
                color: 16758528
            }
        }
        return embed;
    }
    
    // ==================================================================================
    // SAVE DATABASE
    // ==================================================================================

    save() {
        this.model.save();
        return true;
    }

}