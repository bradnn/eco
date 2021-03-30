const User = require('../storage/userSchema');
const { Client } = require('../bot');
const { Time } = require('../modules/Time');
const { Number } = require('../modules/Number');
const client = Client.get();

const cooldowns = {
    work: 20000,
    mine: 120000, //120000
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
    constructor(user, model) {
        this.id = user.id;

        this.user = user;
        
        this.model = model;
    }

    // ==================================================================================
    // COIN MANAGEMENT
    // ==================================================================================

    addCoins(amount = 0) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.balance += amount;
        if (this.model.profiles.economy.balance < 0) this.model.profiles.economy.balance = 0;
        client.logger.econ(`Added ${amount} coins to ${this.id}, new balance: $${this.model.profiles.economy.balance}`);
        return;
    }

    delCoins(amount = 0) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.balance -= amount;
        if (this.model.profiles.economy.balance < 0) this.model.profiles.economy.balance = 0;
        client.logger.econ(`Removed ${amount} coins from ${this.id}, new balance: $${this.model.profiles.economy.balance}`);
        return;
    }

    setCoins(amount = 500) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.balance = amount;
        if (this.model.profiles.economy.balance < 0) this.model.profiles.economy.balance = 0;
        client.logger.econ(`Set ${this.id}'s balance to ${amount} coins`);
        return;
    }

    getCoins() {
        return this.model.profiles.economy.balance;
    }

    // ==================================================================================
    // GEMS MANAGEMENT
    // ==================================================================================

    addGems(amount = 0) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.gems += amount;
        if (this.model.profiles.economy.gems < 0) this.model.profiles.economy.gems = 0;
        client.logger.econ(`Added ${amount} gems to ${this.id}, new balance: $${this.model.profiles.economy.gems}`);
        return;
    }

    delGems(amount = 0) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.gems -= amount;
        if (this.model.profiles.economy.gems < 0) this.model.profiles.economy.gems = 0;
        client.logger.econ(`Removed ${amount} gems from ${this.id}, new balance: $${this.model.profiles.economy.gems}`);
        return;
    }

    setGems(amount = 0) {
        if (isNaN(amount)) amount = 0;
        this.model.profiles.economy.gems = amount;
        if (this.model.profiles.economy.gems < 0) this.model.profiles.economy.gems = 0;
        client.logger.econ(`Set ${this.id}'s balance to ${amount} gems`);
        return;
    }

    getGems() {
        return this.model.profiles.economy.gems;
    }

    // ==================================================================================
    // WORK MANAGEMENT
    // ==================================================================================

    setJob(job = "begger") {
        this.model.profiles.stats.work.job = job;
        client.logger.job(`Set ${this.id}'s job to ${job}`);
        return true;
    }

    getJob() {
        return this.model.profiles.stats.work.job.toLowerCase();
    }

    canGetNextJob() {
        if (this.getJob() == 'Begger') return {canApply: false, nextJob: this.getJob()};
        var jobArray = client.jobs.array().sort((a, b) => {return a.workRequirement - b.workRequirement});
        var index = jobArray.map(function(e) { return e.name; }).indexOf(this.model.profiles.stats.work.job);
        if (index = jobArray.length) return {
            canApply: false,
            nextJob: this.getJob()
        }
        var nextJob = jobArray[index + 1];
        if(this.getWorkCount() >= nextJob.workRequirement && nextJob.name != "Begger") {
            return {
                canApply: true,
                nextJob
            }
        } else {
            return {
                canApply: false,
                nextJob
            }
        }
    }

    getPay(perfect = false, add = true) {
        const JOB_PAY = client.jobs.get(this.getJob()).pay;
        const RAISE_BONUS = this.getRaise().newRaise / 100;
        
        var FINAL_BONUS = RAISE_BONUS;
        if (perfect == true) FINAL_BONUS += 0.5
        FINAL_BONUS += this.getPetBoost("workAmount");

        const PAYOUT = Math.floor(JOB_PAY * (1 + FINAL_BONUS));
        if (add) this.addCoins(PAYOUT);
        return PAYOUT;
    }

    setSick(bool = false) {
        this.model.profiles.stats.work.sick = bool;
        client.logger.sick(`Set ${this.id}'s sickness to ${bool}`);
        return bool;
    }

    getSick() {
        return this.model.profiles.stats.work.sick;
    }

    getRaise() {
        if (this.model.profiles.stats.work.raise.count >= 25) {
            this.model.profiles.stats.work.raise.count = 0;
            this.model.profiles.stats.work.raise.level += 1;
            client.logger.job(`${this.id} got a raise to level ${this.model.profiles.stats.work.raise.level}`);
            return {
                levelUp: true,
                newRaise: this.model.profiles.stats.work.raise.level
            };
        }
        return {
            levelUp: false,
            newRaise: this.model.profiles.stats.work.raise.level
        };
    }

    setRaise(level = 0) {
        this.model.profiles.stats.work.raise.coint = 0;
        this.model.profiles.stats.work.raise.level = level;
        return this.model.profiles.stats.work.raise.level
    }

    addWork() {
        this.model.profiles.stats.work.raise.count += 1;
        this.model.profiles.stats.work.workCount += 1;
    }

    getWorkCount() {
        return this.model.profiles.stats.work.workCount;
    }

    // ==================================================================================
    // COOLDOWN MANAGEMENT
    // ==================================================================================

    getCooldown(type, set = true, msg) {
        const previousTime = this.model.profiles.stats.cooldowns[type]; // When command was last used
        const nowTime = new Date(); //
        const timePassed = Math.abs(previousTime - nowTime);

        var cooldown = cooldowns[type];

        if (type == "work" && this.getSick()) cooldown = 300000;
        if (type == "mine" && this.getPickaxe() == "tanzPickaxe") cooldown = cooldown / 2;

        if (timePassed + 300 < cooldown) {
            const timeLeftMs = Math.ceil(cooldown - timePassed);
            const timeLeftSec = (timeLeftMs / 1000);
            const timeLeftFormatted = Time.format(timeLeftMs);

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
        this.model.profiles.stats.cooldowns[type] = new Date();
        return true;
    }

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
    // LEVEL MANAGEMENT
    // ==================================================================================

    getExp() {
        return this.model.profiles.level.exp;
    }

    addExp(amount = 0) {
        return this.model.profiles.level.exp += amount;
    }

    addRandomExp(min = 10, max = 40) {
        var ogLevel = this.getLevel();
        const amount = Math.floor(Math.random() * (max - min + 1) + min)
        this.model.profiles.level.exp += amount;
        var level = this.getLevel();
        var levelUp = false;
        if (ogLevel < level) levelUp = true;
        return {
            added: amount,
            levelUp
        };
    }

    delExp(amount = 0) {
        return this.model.profiles.level.exp -= amount;
    }

    setExp(amount = 0) {
        return this.model.profiles.level.exp = amount;
    }

    getLevel() {
        const exp = this.model.profiles.level.exp;
        return Math.floor(Math.floor(95 + Math.sqrt(9025 + 380 * exp )) / 190);
    }

    getLevelReq() {
        const exp = this.model.profiles.level.exp;
        const nextLevel = Math.floor(Math.floor(95 + Math.sqrt(9025 + 380 * exp )) / 190) + 1;
        return 95 * nextLevel * nextLevel - 95 * nextLevel;
    }
    
    // ==================================================================================
    // MINE MANAGEMENT
    // ==================================================================================

    getPickaxe() {
        if (this.model.profiles.storage.inventory['00b'] > 0) {
            return "tanzPickaxe";
        } else if (this.model.profiles.storage.inventory['005'] > 0) {
            return "pickaxe";
        } else {
            return "none";
        }
    }

    breakPickaxe() {
        if (this.model.profiles.storage.inventory['00b'] > 0) {
            this.model.profiles.storage.inventory['00b'] -= 1;
            return "tanzPickaxe";
        } else if (this.model.profiles.storage.inventory['005'] > 0) {
            this.model.profiles.storage.inventory['005'] -= 1;
            return "pickaxe";
        } else {
            return "none";
        }
    }

    addMineCount() {
        this.model.profiles.stats.mining.mineCount += 1;
        return this.model.profiles.stats.mining.mineCount;
    }
    
    // ==================================================================================
    // STORAGE MANAGEMENT
    // ==================================================================================

    getInventory() {
        return this.model.profiles.storage.inventory;
    }

    addItem(id, amount = 1) {
        var item = client.items.get(id);
        if (!item) return false;

        var itemPath = this.model.profiles.storage.inventory[item.id];
        if (!itemPath) {
            this.model.profiles.storage.inventory[item.id] = amount;
        } else {
            this.model.profiles.storage.inventory[item.id] += amount;
        }
        return true;
    }

    delItem(id, amount = 1) {
        var item = client.items.get(id);
        if (!item) return false;

        var itemPath = this.model.profiles.storage.inventory[item.id];
        if (!itemPath) {
            this.model.profiles.storage.inventory[item.id] = 0;
        } else {
            this.model.profiles.storage.inventory[item.id] -= amount;
        }
        return true;
    }

    getItem(id) {
        var item = client.items.get(id);
        if (!item) return undefined;
        
        return this.model.profiles.storage.inventory[item.id];
    }
    
    // ==================================================================================
    // PET MANAGEMENT
    // ==================================================================================

    addPet(name, tier) {
        var pet = client.pets.get(name);
        if (!pet) { return false; }
        var nextID, highestID = 0;
        var petStorage = this.model.profiles.storage.pets;

        for (var pet in petStorage) {
            var thisPetID = parseInt(petStorage[pet].id, 16);
            if (thisPetID > highestID) { highestID = thisPetID };
        }
        nextID = Number.convertToHex(highestID += 1);

        this.model.profiles.storage.pets.push({
            id: nextID,
            name: name,
            tier: tier,
            exp: 0,
            active: false
        });

        return;
    }

    setActivePet(id) {
        let obj = this.model.profiles.storage.pets.find(obj => obj.active == true);
        if (obj) { 
            var objIndex = this.model.profiles.storage.pets.indexOf(obj);
            this.model.profiles.storage.pets[objIndex].active = false; 
        };

        let pet = this.model.profiles.storage.pets.find(obj => obj.id == id);
        if (pet) { 
            var petIndex = this.model.profiles.storage.pets.indexOf(pet);
            this.model.profiles.storage.pets[petIndex].active = true; 
        };
        return;
    }

    getPetExp() {
        let obj = this.model.profiles.storage.pets.find(obj => obj.active == true);
        if (obj) {
            return obj.exp;
        } else {
            return "none";
        }
    }

    addPetExp(amt = 1) {
        let obj = this.model.profiles.storage.pets.find(obj => obj.active == true);
        if (obj) { 
            var objIndex = this.model.profiles.storage.pets.indexOf(obj);
            this.model.profiles.storage.pets[objIndex].exp += amt; 
        };
    }

    getPetBoost(type = "all") {
        if (type == "all") {
            let obj = this.model.profiles.storage.pets.find(obj => obj.active == true);
            if (obj) { 
                var pet = client.pets.get(obj.name);
                return {
                    type: pet.boostType,
                    amount: pet.boostAmount[obj.tier]
                };
            };
            return {
                type: "None",
                amount: 0
            };
        } else {
            let obj = this.model.profiles.storage.pets.find(obj => obj.active == true);
            if (obj) { 
                var pet = client.pets.get(obj.name);
                if (pet.boostType == type) {
                    return pet.boostAmount[obj.tier];
                } else {
                    return 0;
                }
            };
            return 0;
        }
    }
    
    // ==================================================================================
    // SAVE DATABASE
    // ==================================================================================

    save() {
        this.model.markModified('profiles.storage.inventory');
        this.model.markModified('profiles.storage.pets');
        this.model.markModified('profiles.stats.cooldowns');
        this.model.save();
        return true;
    }
}