/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

module.exports = async function (sequelize, models) {
  const Sequelize = require('sequelize');

  const Wallet = sequelize.define('wallet', {
    // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
    username: {
      type: Sequelize.STRING(200)
    },
    phone: {
      type: Sequelize.STRING(200)
    },
    email: {
      type: Sequelize.STRING(200)
    },
    passwordHash: {
      type: Sequelize.STRING(200)
    },
    primaryAddress: {
      type: Sequelize.STRING(200)
    },
    encryptedSeed: {
      type: Sequelize.STRING
    },
    cryptoMetadataJson: {
      type: Sequelize.TEXT
    },
    settingsJson: {
      type: Sequelize.TEXT
    }
  } as any, {
    indexes: [
      // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#indexes
      { fields: ['username'], unique: true },
      { fields: ['email'], unique: true },
      { fields: ['primaryAddress'], unique: true },
      { fields: ['email', 'passwordHash'] }
    ]
  } as any);

  return Wallet.sync({});
};
