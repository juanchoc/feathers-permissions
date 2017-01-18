'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setPermissions;

var _utils = require('feathers-hooks-common/lib/utils');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /*
                                                                                                                                                                                                                   * A hook to programmatically set permissions on a resource
                                                                                                                                                                                                                   */

var debug = (0, _debug2.default)('feathers-permissions:hooks:set-permissions');
var defaults = {
  field: 'permissions',
  self: true,
  asArray: true
};

var populatePermissions = function populatePermissions(item, options, id) {
  // Handle permissions like users:remove:id and
  // replace id with the actual resource id.
  var permissions = options.permissions;

  if (options.self) {
    permissions = permissions.map(function (permission) {
      if (id !== undefined && permission.includes(':id')) {
        permission = permission.replace(':id', ':' + id);
      }

      return permission;
    });
  }

  item[options.field] = options.asArray ? permissions : permissions.join(',');

  debug('Setting permissions on field \'' + options.field + '\'', item[options.field]);

  return item;
};

function setPermissions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = Object.assign({}, defaults, options);

  if (!Array.isArray(options.permissions)) {
    return Promise.reject(new Error('options.permissions must be an array of string permissions provided to setPermissions'));
  }

  return function (hook) {
    try {
      (0, _utils.checkContext)(hook, null, ['create', 'patch', 'update'], 'setPermissions');
    } catch (error) {
      return Promise.reject(error);
    }

    var service = this;
    var items = (0, _utils.getItems)(hook);
    items = Array.isArray(items) ? items.map(function (item) {
      return populatePermissions(item, options, hook.id || item[service.id]);
    }) : populatePermissions(items, options, hook.id || items[service.id]);
    (0, _utils.replaceItems)(hook, items);

    if (hook.type === 'before') {
      return Promise.resolve(hook);
    }

    if (hook.type === 'after') {
      // Update entity with new permissions in the DB
      items = Array.isArray(items) ? items : [items];
      var promises = items.map(function (item) {
        return service.patch(hook.id || item[service.id], _defineProperty({}, options.field, item[options.field]));
      });

      // TODO (EK): Handle if an update fails in the middle of updating
      // a bunch of records. Do we roll back? We likely should be using better
      // async flow control here.
      return Promise.all(promises).then(function () {
        return Promise.resolve(hook);
      });
    }
  };
}
module.exports = exports['default'];