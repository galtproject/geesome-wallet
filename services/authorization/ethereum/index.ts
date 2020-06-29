/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

const sigUtil = require('eth-sig-util');

module.exports = {
  getAccountAddressBySignature(signature, messageParams) {
    return sigUtil.recoverTypedMessage({ data: messageParams, sig: signature }, 'V1');
  },
  isSignatureValid(address, signature, messageParams) {
    const signedByAddress = this.getAccountAddressBySignature(signature, messageParams);
    console.log('signedByAddress', signedByAddress);
    return signedByAddress.toLowerCase() === address.toLowerCase();
  }
};
