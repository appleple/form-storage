'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('element-matches-polyfill');

var _formSerialize = require('form-serialize');

var _formSerialize2 = _interopRequireDefault(_formSerialize);

var _queryStringEs = require('query-string-es5');

var _queryStringEs2 = _interopRequireDefault(_queryStringEs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
  name: 'form',
  ignores: [],
  includes: [],
  checkbox: null
};

var FormStorage = function () {
  function FormStorage(selector, opt) {
    _classCallCheck(this, FormStorage);

    this.ele = document.querySelector(selector);
    this.opt = Object.assign({}, defaults, opt);
    if (this.opt.checkbox) {
      this.checkbox = document.querySelector(this.opt.checkbox);
      this.setCheckbox();
      this.apply();
    }
  }

  _createClass(FormStorage, [{
    key: 'save',
    value: function save() {
      var str = (0, _formSerialize2.default)(this.ele);
      window.localStorage.setItem(this.opt.name, str);
    }
  }, {
    key: 'clear',
    value: function clear() {
      window.localStorage.removeItem(this.opt.name);
    }
  }, {
    key: 'setCheckbox',
    value: function setCheckbox() {
      var _this = this;

      this.ele.addEventListener('submit', function () {
        if (_this.checkbox.checked) {
          _this.save();
        } else {
          _this.clear();
        }
      });
    }
  }, {
    key: 'getState',
    value: function getState() {
      return (0, _formSerialize2.default)(this.ele);
    }
  }, {
    key: 'applyState',
    value: function applyState(str) {
      var _this2 = this;

      var _opt = this.opt,
          ignores = _opt.ignores,
          includes = _opt.includes;

      var obj = _queryStringEs2.default.parse(str.replace(/^"(.*)"$/, "$1"));

      var _loop = function _loop(key) {
        var flag = false;
        var target = _this2.ele.querySelector('[name="' + key + '"]');
        var targets = _this2.ele.querySelectorAll('[name="' + key + '"]');

        if (!target) {
          return 'continue';
        }

        ignores.forEach(function (ignore) {
          if (target.matches(ignore)) {
            flag = true;
            return false;
          }
        });

        if (flag) {
          return 'continue';
        }

        if (includes.length > 0) {
          flag = true;
          includes.forEach(function (include) {
            if (target.matches(include)) {
              flag = false;
              return false;
            }
          });
          if (flag) {
            return 'continue';
          }
        }

        if (targets && targets.length > 1) {
          var arr = obj[key];
          [].forEach.call(targets, function (tar, index) {
            if (tar.type === 'checkbox') {
              if (arr.forEach) {
                arr.forEach(function (item) {
                  if (item === tar.value) {
                    tar.checked = true;
                  }
                });
              } else {
                if (arr === tar.value) {
                  tar.checked = true;
                }
              }
            } else if (tar.type === 'radio') {
              if (tar.value === arr) {
                tar.checked = true;
              }
            }
          });
          return 'continue';
        }

        if (target.type === 'radio' || target.type === 'checkbox') {
          if (obj[key] === target.value) {
            target.checked = true;
          }
        } else {
          target.value = obj[key];
        }
      };

      for (var key in obj) {
        var _ret = _loop(key);

        if (_ret === 'continue') continue;
      }
    }
  }, {
    key: 'apply',
    value: function apply() {
      var str = window.localStorage.getItem(this.opt.name);
      if (!str) {
        return;
      }
      this.applyState(str);
    }
  }]);

  return FormStorage;
}();

exports.default = FormStorage;
module.exports = exports['default'];