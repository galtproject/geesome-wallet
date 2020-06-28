/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGAppService} from "../services/appService/interface";

const service = require('restana')({
    ignoreTrailingSlash: true,
    maxParamLength: 2000
});
const bodyParser = require('body-parser');

module.exports = (appService: IGAppService, port) => {
    require('./showEndpointsTable');
    service.use(bodyParser.json());

    function setHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.setHeader('Access-Control-Allow-Headers', "*");
    }

    service.post('/v1/create-wallet', async (req, res) => {
        res.send(await appService.createWallet(req.body));
    });

    service.post('/v1/get-crypto-metadata-by-email', async (req, res) => {
        res.send(await appService.getCryptoMetadataByEmail(req.body.email));
    });

    service.post('/v1/get-wallet-by-email-and-password-hash', async (req, res) => {
        res.send(await appService.getWalletByEmailAndPasswordHash(req.body.email, req.body.passwordHash));
    });

    service.post('/v1/update-wallet', async (req, res) => {
        res.send(await appService.updateWallet(req.body.email, req.body.passwordHash, req.body.updateData));
    });

    service.options("/*", function (req, res, next) {
        setHeaders(res);
        res.send(200);
    });
    service.head("/*", function (req, res, next) {
        setHeaders(res);
        res.send(200);
    });
    
    console.log('🚀 Start application on port', port);
    
    return service.start(port);
};


