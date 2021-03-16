const userModel = require('../../structures/models/User.js');
const userClass = require('../../resources/classes/userClass');

module.exports.ProfileUtils = {
    get: async function (user, client) {
        if (client.profiles.get(user.id)) {
            return client.profiles.get(user.id);
        }

        let res = await userModel.findOne ({userID: user.id}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = await userModel.create({
                userID: user.id
            });
        }
        const newClass = new userClass(res, user);
        client.profiles.set(user.id, newClass);
        return newClass;
    }
}