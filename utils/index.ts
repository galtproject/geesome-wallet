/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

export {};

const _ = require('lodash');

module.exports = {
    durationDays(fromDate, toDate) {
        const diffTimestamp = toDate.getTime() - fromDate.getTime();
        return Math.ceil(diffTimestamp / (24 * 60 * 60 * 1000));
    },
    moveFromDate(fromDate, value, unit) {
        if(_.includes(unit, 'second')) {
            return new Date(fromDate.getTime() + value * 1000);
        }
        if(_.includes(unit, 'minute')) {
            return new Date(fromDate.getTime() + value * 60 * 1000);
        }
        if(_.includes(unit, 'hour')) {
            return new Date(fromDate.getTime() + value * 60 * 60 * 1000);
        }
        if(_.includes(unit, 'day')) {
            return new Date(fromDate.getTime() + value * 24 * 60 * 60 * 1000);
        }
        if(_.includes(unit, 'week')) {
            return new Date(fromDate.getTime() + value * 7 * 24 * 60 * 60 * 1000);
        }
        if(_.includes(unit, 'month')) {
            return new Date(fromDate.getTime() + value * 30 * 24 * 60 * 60 * 1000);
        }
        return null;
    },
    moveDate(value, unit) {
        return this.moveFromDate(new Date(), value, unit);
    }
};
