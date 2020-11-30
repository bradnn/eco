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
            x = await serverModel.create({
                serverID: serverID,
                config: {
                    prefix: ";"
                }
            });
            return ";";
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
            x = await serverModel.create({
                serverID: serverID,
                config: {
                    prefix: ";"
                }
            });
        };

        x.config.prefix = prefix;
        await x.save();

        return x.config.prefix;
    }
}