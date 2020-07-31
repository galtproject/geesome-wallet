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
          cookie : {
              sameSite: 'none', // TODO: check security
              secure: true
          }
      })
    );
    store.sync();

    function setHeaders(req, res) {
        if(req.headers.origin) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    }

    function setSession(req, wallet = null, pendingWallet = null) {
        return new Promise((resolve) => {
            req.session.walletId = wallet ? wallet.id : null;
            req.session.pendingWalletId = pendingWallet ? pendingWallet.id : null;

            if(!req.session.secret) {
                req.session.secret = ethers.Wallet.createRandom().privateKey;
            }
            req.session.save(async (err) => {
                resolve();
                if(err) {
                    console.error('session.save', err);
                }
            });
        });
    }

    // GETTERS
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
        res.send(await appService.getCryptoMetadataByUsername(req.body.username));
    });

    // AUTHENTICATE
    service.post('/v1/register', async (req, res) => {
        setHeaders(req, res);
        //TODO: restrict requests count
        const {wallet, pendingWallet} = await appService.register(req.body);
        await setSession(req, wallet, pendingWallet);
        res.send({wallet, pendingWallet});
    });

    service.post('/v1/confirm-wallet', async (req, res) => {
        setHeaders(req, res);
        const {wallet, pendingWallet} = await appService.confirmPendingWalletByCode(req.session.pendingWalletId, req.body.confirmationMethod, req.body.value, req.body.code);
        await setSession(req, wallet, pendingWallet);
        res.send({wallet, pendingWallet});
    });

    service.post('/v1/resend-confirmation', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.resendConfirmationCode(req.body.confirmationMethod, req.session.pendingWalletId));
    });

    service.post('/v1/get-wallet-by-email-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByEmailAndPasswordHash(req.body.email, req.body.emailPasswordHash);
        await setSession(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-wallet-by-phone-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByPhoneAndPasswordHash(req.body.phone, req.body.phonePasswordHash);
        await setSession(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-wallet-by-username-and-password-hash', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletByUsernameAndPasswordHash(req.body.username, req.body.usernamePasswordHash);
        await setSession(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-auth-message', async (req, res) => {
        setHeaders(req, res);
        res.send(await appService.getAuthMessage(req.body.primaryAddress));
    });

    service.post('/v1/get-wallet-by-signature', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.getWalletBySignature(req.body.primaryAddress, req.body.signature);
        await setSession(req, wallet);
        res.send(wallet);
    });

    service.post('/v1/get-session', async (req, res) => {
        setHeaders(req, res);
        res.send({secret: req.session.secret, wallet: req.session.walletId ? await appService.database.getWallet(req.session.walletId) : null});
    });

    // WALLET CONTROL
    service.post('/v1/update-wallet', async (req, res) => {
        setHeaders(req, res);
        const {wallet, pendingWallet} = await appService.updateWallet(req.body.primaryAddress, req.body.signature, req.body.walletData, req.body.expiredOn);
        await setSession(req, wallet, pendingWallet);
        res.send({wallet, pendingWallet});
    });

    service.post('/v1/delete-wallet', async (req, res) => {
        setHeaders(req, res);
        res.send({result: await appService.deleteWallet(req.session.walletId, req.body.signature)});
    });

    // ADMIN INTERFACE
    service.post('/v1/admin/confirm-wallet', async (req, res) => {
        setHeaders(req, res);
        const wallet = await appService.confirmPendingWalletByAdmin(req.body.signature, req.body.pendingWalletId, req.body.confirmMethods);
        res.send(wallet);
    });

    // COORS
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


