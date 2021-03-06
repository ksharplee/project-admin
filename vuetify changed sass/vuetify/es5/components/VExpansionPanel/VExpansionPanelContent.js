"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transitions = require("../transitions");

var _bootable = _interopRequireDefault(require("../../mixins/bootable"));

var _registrable = require("../../mixins/registrable");

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
// Utilities
var baseMixins = (0, _mixins.default)(_bootable.default, (0, _registrable.inject)('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel'));
/* @vue/component */

var _default = baseMixins.extend().extend({
  name: 'v-expansion-panel-content',
  computed: {
    isActive: function isActive() {
      return this.expansionPanel.isActive;
    }
  },
  created: function created() {
    this.expansionPanel.registerContent(this);
  },
  beforeDestroy: function beforeDestroy() {
    this.expansionPanel.unregisterContent();
  },
  render: function render(h) {
    return h(_transitions.VExpandTransition, [h('div', {
      staticClass: 'v-expansion-panel-content',
      directives: [{
        name: 'show',
        value: this.isActive
      }]
    }, this.showLazyContent([h('div', {
      class: 'v-expansion-panel-content__wrap'
    }, (0, _helpers.getSlot)(this))]))]);
  }
});

exports.default = _default;
//# sourceMappingURL=VExpansionPanelContent.js.map