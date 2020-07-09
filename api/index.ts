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
    maxParamLength: 2000,
    errorHandler
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

    function setSecret(req, wallet = null, pendingWallet = null) {
        return new Promise((resolve) => {
            req.session.walletId = wallet ? wallet.id : null;
            req.session.pendingWalletId = pendingWallet ? pendingWallet.id : null;

            if(!req.session.secret) {
                req.session.secret = ethers.Wallet.createRandom().privateKey;
            }
            req.session.save(async (err) => {resolve()});
        });
    }

    //TODO: deprecated, delete
    service.post('/v1/create-wallet', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.createWallet(req.body);
        await setSecret(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/register', async (req, res) => {
        setHeaders(req, res);
        const pendingWallet = await appService.createPendingWallet(req.body);
        await setSecret(req, null, pendingWallet);
        res.send({pendingWallet});
    });

    service.post('/v1/confirm-wallet', async (req, res) => {
        setHeaders(req, res);
        //TODO: restrict requests count
        const wallet = await appService.confirmPendingWalletByCode(req.body.confirmationMethod, req.body.value, req.body.code);
        await setSecret(req, wallet);
        res.send({wallet});
    });

    service.post('/v1/get-crypto-metadata-by-email', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.getCryptoMetadataByEmail(req.body.email));
    });

    service.post('/v1/get-crypto-metadata-by-phone', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.getCryptoMetadataByPhone(req.body.phone));
    });

    service.post('/v1/get-crypto-metadata-by-username', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.getCryptoMetadataByPhone(req.body.username));
    });

    service.post('/v1/get-wallet-by-email-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByEmailAndPasswordHash(req.body.email, req.body.emailPasswordHash);
        await setSecret(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-wallet-by-phone-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByPhoneAndPasswordHash(req.body.phone, req.body.phonePasswordHash);
        await setSecret(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-wallet-by-username-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByUsernameAndPasswordHash(req.body.username, req.body.usernamePasswordHash);
        await setSecret(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/update-wallet', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.updateWallet(req.body.primaryAddress, req.body.signature, req.body.walletData, req.body.expiredOn));
    });

    service.post('/v1/get-session', async (req, res) => {
        setHeaders(req, res);
        res.send({secret: req.session.secret, wallet: req.session.walletId ? await appService.database.getWallet(req.session.walletId) : null});
    });

    service.post('/v1/admin/confirm-wallet', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.confirmPendingWalletByAdmin(req.body.signature, req.body.pendingWalletId, req.body.confirmMethods);
        res.send(wallet);
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

function errorHandler (err, req, res) {
    console.log(`Something was wrong: ${err.message || err}`, err);
    res.send(err)
}


