'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _StyleSheetManager = require('./StyleSheetManager');

var _StyleSheetManager2 = _interopRequireDefault(_StyleSheetManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_Tag = require('./StyleSheet').babelPluginFlowReactPropTypes_proptype_Tag || require('react').PropTypes.any;

var ServerTag = function () {
  function ServerTag(isLocal) {
    _classCallCheck(this, ServerTag);

    this.isLocal = isLocal;
    this.components = {};
    this.size = 0;
    this.names = [];
  }

  _createClass(ServerTag, [{
    key: 'isFull',
    value: function isFull() {
      return false;
    }
  }, {
    key: 'addComponent',
    value: function addComponent(componentId) {
      if (this.components[componentId]) throw new Error('Trying to add Component \'' + componentId + '\' twice!');
      this.components[componentId] = { componentId: componentId, css: '' };
      this.size += 1;
    }
  }, {
    key: 'inject',
    value: function inject(componentId, css, name) {
      var comp = this.components[componentId];

      if (!comp) throw new Error('Must add a new component before you can inject css into it');
      if (comp.css === '') comp.css = '/* sc-component-id: ' + componentId + ' */\n';

      comp.css += css.replace(/\n*$/, '\n');

      if (name) this.names.push(name);
    }
  }, {
    key: 'toHTML',
    value: function toHTML() {
      var _this = this;

      var namesAttr = _StyleSheet.SC_ATTR + '="' + this.names.join(' ') + '"';
      var localAttr = _StyleSheet.LOCAL_ATTR + '="' + (this.isLocal ? 'true' : 'false') + '"';
      var css = Object.keys(this.components).map(function (key) {
        return _this.components[key].css;
      }).join('');

      return '<style type="text/css" ' + namesAttr + ' ' + localAttr + '>\n' + css + '\n</style>';
    }
  }, {
    key: 'clone',
    value: function clone() {
      var _this2 = this;

      var copy = new ServerTag(this.isLocal);
      copy.names = [].concat(this.names);
      copy.size = this.size;
      copy.components = Object.keys(this.components).reduce(function (acc, key) {
        acc[key] = _extends({}, _this2.components[key]); // eslint-disable-line no-param-reassign
        return acc;
      }, {});

      return copy;
    }
  }]);

  return ServerTag;
}();

var ServerStyleSheet = function () {
  function ServerStyleSheet() {
    _classCallCheck(this, ServerStyleSheet);

    this.instance = _StyleSheet2.default.clone(_StyleSheet2.default.instance);
  }

  _createClass(ServerStyleSheet, [{
    key: 'collectStyles',
    value: function collectStyles(children) {
      if (this.closed) throw new Error("Can't collect styles once you've called getStyleTags!");
      return _react2.default.createElement(
        _StyleSheetManager2.default,
        { sheet: this.instance },
        children
      );
    }
  }, {
    key: 'getStyleTags',
    value: function getStyleTags() {
      if (!this.closed) {
        _StyleSheet.clones.splice(_StyleSheet.clones.indexOf(this.instance), 1);
        this.closed = true;
      }

      return this.instance.toHTML();
    }
  }], [{
    key: 'create',
    value: function create() {
      return new _StyleSheet2.default(function (isLocal) {
        return new ServerTag(isLocal);
      });
    }
  }]);

  return ServerStyleSheet;
}();

exports.default = ServerStyleSheet;
module.exports = exports['default'];