/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGDatabase} from "./database/interface";
import {IGAppService} from "./services/appService/interface";

const config = require('./config.ts');
const fs = require('fs');

(async() => {
    const databaseConfig: any = {};
    if(process.env.DATABASE_NAME) {
        databaseConfig.name = process.env.DATABASE_NAME;
    }
    
    const database: IGDatabase = await require('./database/' + config.database)(databaseConfig);

    const appService: IGAppService = await require('./services/appService/' + config.appService)(database, null);

    if(fs.existsSync('./admins.json')) {
        appService.setAdminsAddresses(require('./admins.json'));
    }

    // console.log('database.getWalletCount', await database.getWalletCount());
    // console.log('database.getWalletList', await database.getWalletList());

    const server = await require('./api/')(appService, process.env.API_PORT || config.apiPort);

})().catch((e) => {
    console.error('app error', new Date(), e);
});


process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});
