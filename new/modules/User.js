const { Client } = require("../bot");
const userSchema = require("../storage/userSchema");
const userClass = require("../classes/userClass");
const client = Client.get();

module.exports.User = {
    get: async function (user) {
        if (client.profiles.get(user.id)) {
            return client.profiles.get(user.id);
        }

        let lookup = await userSchema({userID: user.id}, function (err, res) {
            if (err) throw err;
            if (res) throw res;
        });
        if (!lookup) { lookup = this.create(user.id) };
        const newUser = new userClass(user, lookup);
        client.profiles.set(user.id, newUser);
        return newUser;
    },
    create: async function (id) {
        return await userSchema.create({
            userID: id
        });
    }
}