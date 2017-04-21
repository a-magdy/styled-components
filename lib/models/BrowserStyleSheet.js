'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COMPONENTS_PER_TAG = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/*
 * Browser Style Sheet with Rehydration
 *
 * <style data-styled-components="x y z"
 *        data-styled-components-is-local="true">
 *   /· sc-component-id: a ·/
 *   .sc-a { ... }
 *   .x { ... }
 *   /· sc-component-id: b ·/
 *   .sc-b { ... }
 *   .y { ... }
 *   .z { ... }
 * </style>
 *
 * Note: replace · with * in the above snippet.
 * */


var _extractCompsFromCSS = require('../utils/extractCompsFromCSS');

var _extractCompsFromCSS2 = _interopRequireDefault(_extractCompsFromCSS);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_Tag = require('./StyleSheet').babelPluginFlowReactPropTypes_proptype_Tag || require('react').PropTypes.any;

var COMPONENTS_PER_TAG = exports.COMPONENTS_PER_TAG = 40;

var BrowserTag = function () {
  function BrowserTag(el, isLocal) {
    var existingSource = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    _classCallCheck(this, BrowserTag);

    this.el = el;
    this.isLocal = isLocal;
    this.ready = false;

    var extractedComps = (0, _extractCompsFromCSS2.default)(existingSource);

    this.size = extractedComps.length;
    this.components = extractedComps.reduce(function (acc, obj) {
      acc[obj.componentId] = obj; // eslint-disable-line no-param-reassign
      return acc;
    }, {});
  }

  _createClass(BrowserTag, [{
    key: 'isFull',
    value: function isFull() {
      return this.size >= COMPONENTS_PER_TAG;
    }
  }, {
    key: 'addComponent',
    value: function addComponent(componentId) {
      if (!this.ready) this.replaceElement();
      if (this.components[componentId]) throw new Error('Trying to add Component \'' + componentId + '\' twice!');

      var comp = { componentId: componentId, textNode: document.createTextNode('') };
      this.el.appendChild(comp.textNode);

      this.size += 1;
      this.components[componentId] = comp;
    }
  }, {
    key: 'inject',
    value: function inject(componentId, css, name) {
      if (!this.ready) this.replaceElement();
      var comp = this.components[componentId];

      if (!comp) throw new Error('Must add a new component before you can inject css into it');
      if (comp.textNode.data === '') comp.textNode.appendData('\n/* sc-component-id: ' + componentId + ' */\n');

      comp.textNode.appendData(css);
      if (name) {
        var existingNames = this.el.getAttribute(_StyleSheet.SC_ATTR);
        this.el.setAttribute(_StyleSheet.SC_ATTR, existingNames ? existingNames + ' ' + name : name);
      }
    }
  }, {
    key: 'toHTML',
    value: function toHTML() {
      return this.el.outerHTML;
    }
  }, {
    key: 'clone',
    value: function clone() {
      throw new Error('BrowserTag cannot be cloned!');
    }

    /* Because we care about source order, before we can inject anything we need to
     * create a text node for each component and replace the existing CSS. */

  }, {
    key: 'replaceElement',
    value: function replaceElement() {
      var _this = this;

      this.ready = true;
      // We have nothing to inject. Use the current el.
      if (this.size === 0) return;

      // Build up our replacement style tag
      var newEl = this.el.cloneNode();
      newEl.appendChild(document.createTextNode('\n'));

      Object.keys(this.components).forEach(function (key) {
        var comp = _this.components[key];

        // eslint-disable-next-line no-param-reassign
        comp.textNode = document.createTextNode(comp.cssFromDOM);
        newEl.appendChild(comp.textNode);
      });

      if (!this.el.parentNode) throw new Error("Trying to replace an element that wasn't mounted!");

      // The ol' switcheroo
      this.el.parentNode.replaceChild(newEl, this.el);
      this.el = newEl;
    }
  }]);

  return BrowserTag;
}();

/* Factory function to separate DOM operations from logical ones*/


exports.default = {
  create: function create() {
    var tags = [];
    var names = {};

    /* Construct existing state from DOM */
    Array.from(document.querySelectorAll('[' + _StyleSheet.SC_ATTR + ']')).forEach(function (el) {
      tags.push(new BrowserTag(el, el.getAttribute(_StyleSheet.LOCAL_ATTR) === 'true', el.innerHTML));

      var attr = el.getAttribute(_StyleSheet.SC_ATTR);
      if (attr) {
        attr.trim().split(/\s+/).forEach(function (name) {
          names[name] = true;
        });
      }
    });

    /* Factory for making more tags */
    var tagConstructor = function tagConstructor(isLocal) {
      var el = document.createElement('style');
      el.type = 'text/css';
      el.setAttribute(_StyleSheet.SC_ATTR, '');
      el.setAttribute(_StyleSheet.LOCAL_ATTR, isLocal ? 'true' : 'false');
      if (!document.head) throw new Error('Missing document <head>');
      document.head.appendChild(el);
      return new BrowserTag(el, isLocal);
    };

    return new _StyleSheet2.default(tagConstructor, tags, names);
  }
};