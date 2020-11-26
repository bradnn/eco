const serverModel = require('../models/Server.js');

module.exports.PrefixUtils = {
    get: async function (serverID) {
        let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = serverModel.create({
                serverID: serverID
            });
        };
        return x.config.prefix;
    },
    set: async function (serverID, prefix) {
        let x = await serverModel.findOne({serverID: serverID}, async function (err, res) {
            if (err) throw err;
            if (res) {
                return res;
            }
        });
        if(!x) {
            x = serverModel.create({
                serverID: serverID
            });
        };

        x.config.prefix = prefix;
        await x.save();

        return x.config.prefix;
    }
}