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

  const PendingWallet = sequelize.define('pendingWallet', {
    // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
    username: {
      type: Sequelize.STRING(200)
    },
    phone: {
      type: Sequelize.STRING(200)
    },
    phoneConfirmationCode: {
      type: Sequelize.STRING(200)
    },
    phoneConfirmationSentAt: {
      type: Sequelize.DATE
    },
    phoneConfirmationSentCount: {
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING(200)
    },
    emailConfirmationCode: {
      type: Sequelize.STRING(200)
    },
    emailConfirmationSentAt: {
      type: Sequelize.DATE
    },
    emailConfirmationSentCount: {
      type: Sequelize.INTEGER
    },
    emailPasswordHash: {
      type: Sequelize.STRING(200)
    },
    phonePasswordHash: {
      type: Sequelize.STRING(200)
    },
    usernamePasswordHash: {
      type: Sequelize.STRING(200)
    },
    primaryAddress: {
      type: Sequelize.STRING(200)
    },
    emailEncryptedSeed: {
      type: Sequelize.STRING
    },
    phoneEncryptedSeed: {
      type: Sequelize.STRING
    },
    usernameEncryptedSeed: {
      type: Sequelize.STRING
    },
    cryptoMetadataJson: {
      type: Sequelize.TEXT
    },
    expiredOn: {
      type: Sequelize.DATE
    }
  } as any, {
    indexes: [
      // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#indexes
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['primaryAddress'] },
      { fields: ['email', 'emailPasswordHash'] },
      { fields: ['username', 'usernamePasswordHash'] },
      { fields: ['phone', 'phonePasswordHash'] }
    ]
  } as any);

  PendingWallet.belongsTo(models.Wallet, {as: 'updateWallet', foreignKey: 'updateWalletId'});
  models.Wallet.hasMany(PendingWallet, {as: 'pendingWallets', foreignKey: 'updateWalletId'});

  return PendingWallet.sync({});
};
