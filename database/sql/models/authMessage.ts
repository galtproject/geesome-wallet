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

  const AuthMessage = sequelize.define('authMessage', {
    // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
    primaryAddress: {
      type: Sequelize.STRING(200)
    },
    code: {
      type: Sequelize.STRING(200)
    },
    expiredOn: {
      type: Sequelize.DATE
    }
  } as any, {
    indexes: [
      // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#indexes
      { fields: ['primaryAddress', 'code'], unique: true }
    ]
  } as any);

  return AuthMessage.sync({});
};