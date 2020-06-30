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
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const ethers = require('ethers');

module.exports = (appService: IGAppService, port) => {
    service.use(bodyParser.json());

    let secret;
    if(fs.existsSync('./secret')) {
        secret = fs.readFileSync('./secret', {encoding: 'utf8'});
    } else {
        secret = uuidv4();
        fs.writeFileSync('./secret', secret, {encoding: 'utf8'});
    }

    const store = new SequelizeStore({ db: appService.database.sequelize });
    service.use(
      session({
          secret,
          store,
          resave: false, // we support the touch method so per the express-session docs this should be set to false
          proxy: true, // if you do SSL outside of node.
      })
    );
    store.sync();

    function setHeaders(req, res) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    }

    service.post('/v1/create-wallet', async (req, res) => {
        setHeaders(req, res);
        req.session.secret = ethers.Wallet.createRandom().privateKey;
        res.send(await appService.createWallet(req.body));
    });

    service.post('/v1/get-crypto-metadata-by-email', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.getCryptoMetadataByEmail(req.body.email));
    });

    service.post('/v1/get-wallet-by-email-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        req.session.secret = ethers.Wallet.createRandom().privateKey;
        res.send(await appService.getWalletByEmailAndPasswordHash(req.body.email, req.body.passwordHash));
    });

    service.post('/v1/update-wallet', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.updateWallet(req.body.primaryAddress, req.body.signature, req.body.walletData, req.body.expiredOn));
    });

    service.post('/v1/get-session', async (req, res) => {
        setHeaders(req, res);
        res.send({secret: req.session.secret});
    });

    service.options("/*", function (req, res, next) {
        setHeaders(req, res);
        res.send(200);
    });
    service.head("/*", function (req, res, next) {
        setHeaders(req, res);
        res.send(200);
    });
    
    console.log('🚀 Start application on port', port);
    
    return service.start(port);
};


