'use strict';

// import errors from 'feathers-errors';
// import Debug from 'debug';
var Debug = require('debug');
var debug = Debug('feathers-permissions:filters:is-permitted');

module.exports = function isPermitted() {
  return function (data, connection, hook) {
    if (data.__isPermitted) {
      debug('Connection is permitted. Dispatching event.');
      return data;
    }

    debug('Connection is not permitted.');
    return false;
  };
};