module.exports = class {
    constructor() {
        this.cmd = 'atest'
    }

    async run(client, msg, args) {
        client.donateApi.getNewDonations().then(donations => {

        }).catch(err => {
            console.log(err);
        });
        return;
    }
}