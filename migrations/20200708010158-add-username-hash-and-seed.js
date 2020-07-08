'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ordersTable = await queryInterface.describeTable('wallets');

    if(ordersTable['usernamePasswordHash']) {
      return;
    }

    return Promise.all([
      queryInterface.addColumn('wallets', 'usernamePasswordHash', {
        type: Sequelize.STRING(200)
      }).catch(() => {}),
      queryInterface.addColumn('wallets', 'usernameEncryptedSeed', {
        type: Sequelize.STRING
      }).catch(() => {})
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('wallets', 'usernamePasswordHash').catch(() => {}),
      queryInterface.removeColumn('wallets', 'usernameEncryptedSeed').catch(() => {}),
    ]);
  }
};