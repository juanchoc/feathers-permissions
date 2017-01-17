'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPermitted = require('./is-permitted');

var _isPermitted2 = _interopRequireDefault(_isPermitted);

var _checkPermissions = require('./check-permissions');

var _checkPermissions2 = _interopRequireDefault(_checkPermissions);

var _setPermissions = require('./set-permissions');

var _setPermissions2 = _interopRequireDefault(_setPermissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  isPermitted: _isPermitted2.default,
  checkPermissions: _checkPermissions2.default,
  setPermissions: _setPermissions2.default
};
module.exports = exports['default'];