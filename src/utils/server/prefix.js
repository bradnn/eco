const serverModel = require('../../structures/models/Server.js');

module.exports.PrefixUtils = {
    get: async function (serverID) {
        let res = await serverModel.findOne({serverID: serverID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });

        if (!res) {
            res = await serverModel.create({
                serverID: serverID,
                config: {
                    prefix: ';'
                }
            });
            return ";";
        }
        return res.config.prefix;
    }
}