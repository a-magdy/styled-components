'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hash = require('../vendor/glamor/hash');

var _hash2 = _interopRequireDefault(_hash);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_Stringifier = require('../types').babelPluginFlowReactPropTypes_proptype_Stringifier || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_Flattener = require('../types').babelPluginFlowReactPropTypes_proptype_Flattener || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_NameGenerator = require('../types').babelPluginFlowReactPropTypes_proptype_NameGenerator || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_RuleSet = require('../types').babelPluginFlowReactPropTypes_proptype_RuleSet || require('react').PropTypes.any;

/*
 ComponentStyle is all the CSS-specific stuff, not
 the React-specific stuff.
 */
exports.default = function (nameGenerator, flatten, stringifyRules) {
  var ComponentStyle = function () {
    function ComponentStyle(rules, componentId) {
      _classCallCheck(this, ComponentStyle);

      this.rules = rules;
      this.componentId = componentId;
      if (!_StyleSheet2.default.instance.hasInjectedComponent(this.componentId)) {
        var placeholder = process.env.NODE_ENV !== 'production' ? '.' + componentId + ' {}' : '';
        _StyleSheet2.default.instance.deferredInject(componentId, true, placeholder);
      }
    }

    /*
     * Flattens a rule set into valid CSS
     * Hashes it, wraps the whole chunk in a .hash1234 {}
     * Returns the hash to be injected on render()
     * */


    _createClass(ComponentStyle, [{
      key: 'generateAndInjectStyles',
      value: function generateAndInjectStyles(executionContext, styleSheet) {
        var flatCSS = flatten(this.rules, executionContext);
        var hash = (0, _hash2.default)(this.componentId + flatCSS.join(''));

        var existingName = styleSheet.getName(hash);
        if (existingName) return existingName;

        var name = nameGenerator(hash);
        if (styleSheet.alreadyInjected(hash, name)) return name;

        var css = '\n' + stringifyRules(flatCSS, '.' + name);
        styleSheet.inject(this.componentId, true, css, hash, name);
        return name;
      }
    }], [{
      key: 'generateName',
      value: function generateName(str) {
        return nameGenerator((0, _hash2.default)(str));
      }
    }]);

    return ComponentStyle;
  }();

  return ComponentStyle;
};

module.exports = exports['default'];