"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VCard/VCard.sass");

var _VSimpleCheckbox = _interopRequireDefault(require("../VCheckbox/VSimpleCheckbox"));

var _VDivider = _interopRequireDefault(require("../VDivider"));

var _VSubheader = _interopRequireDefault(require("../VSubheader"));

var _VList = require("../VList");

var _ripple = _interopRequireDefault(require("../../directives/ripple"));

var _colorable = _interopRequireDefault(require("../../mixins/colorable"));

var _themeable = _interopRequireDefault(require("../../mixins/themeable"));

var _helpers = require("../../util/helpers");

var _mixins = _interopRequireDefault(require("../../util/mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* @vue/component */
var _default2 = (0, _mixins.default)(_colorable.default, _themeable.default).extend({
  name: 'v-select-list',
  // https://github.com/vuejs/vue/issues/6872
  directives: {
    ripple: _ripple.default
  },
  props: {
    action: Boolean,
    dense: Boolean,
    hideSelected: Boolean,
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    itemDisabled: {
      type: [String, Array, Function],
      default: 'disabled'
    },
    itemText: {
      type: [String, Array, Function],
      default: 'text'
    },
    itemValue: {
      type: [String, Array, Function],
      default: 'value'
    },
    noDataText: String,
    noFilter: Boolean,
    searchInput: {
      default: null
    },
    selectedItems: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    parsedItems: function parsedItems() {
      var _this = this;

      return this.selectedItems.map(function (item) {
        return _this.getValue(item);
      });
    },
    tileActiveClass: function tileActiveClass() {
      return Object.keys(this.setTextColor(this.color).class || {}).join(' ');
    },
    staticNoDataTile: function staticNoDataTile() {
      var tile = {
        attrs: {
          role: undefined
        },
        on: {
          mousedown: function mousedown(e) {
            return e.preventDefault();
          }
        }
      };
      return this.$createElement(_VList.VListItem, tile, [this.genTileContent(this.noDataText)]);
    }
  },
  methods: {
    genAction: function genAction(item, inputValue) {
      var _this2 = this;

      return this.$createElement(_VList.VListItemAction, [this.$createElement(_VSimpleCheckbox.default, {
        props: {
          color: this.color,
          value: inputValue
        },
        on: {
          input: function input() {
            return _this2.$emit('select', item);
          }
        }
      })]);
    },
    genDivider: function genDivider(props) {
      return this.$createElement(_VDivider.default, {
        props: props
      });
    },
    genFilteredText: function genFilteredText(text) {
      text = text || '';
      if (!this.searchInput || this.noFilter) return (0, _helpers.escapeHTML)(text);

      var _this$getMaskedCharac = this.getMaskedCharacters(text),
          start = _this$getMaskedCharac.start,
          middle = _this$getMaskedCharac.middle,
          end = _this$getMaskedCharac.end;

      return "".concat((0, _helpers.escapeHTML)(start)).concat(this.genHighlight(middle)).concat((0, _helpers.escapeHTML)(end));
    },
    genHeader: function genHeader(props) {
      return this.$createElement(_VSubheader.default, {
        props: props
      }, props.header);
    },
    genHighlight: function genHighlight(text) {
      return "<span class=\"v-list-item__mask\">".concat((0, _helpers.escapeHTML)(text), "</span>");
    },
    genLabelledBy: function genLabelledBy(item) {
      var text = (0, _helpers.escapeHTML)(this.getText(item).split(' ').join('-').toLowerCase());
      return "".concat(text, "-list-item-").concat(this._uid);
    },
    getMaskedCharacters: function getMaskedCharacters(text) {
      var searchInput = (this.searchInput || '').toString().toLocaleLowerCase();
      var index = text.toLocaleLowerCase().indexOf(searchInput);
      if (index < 0) return {
        start: '',
        middle: text,
        end: ''
      };
      var start = text.slice(0, index);
      var middle = text.slice(index, index + searchInput.length);
      var end = text.slice(index + searchInput.length);
      return {
        start: start,
        middle: middle,
        end: end
      };
    },
    genTile: function genTile(item) {
      var _this3 = this;

      var disabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!value) value = this.hasItem(item);

      if (item === Object(item)) {
        disabled = disabled !== null ? disabled : this.getDisabled(item);
      }

      var tile = {
        attrs: {
          // Default behavior in list does not
          // contain aria-selected by default
          'aria-selected': String(value),
          'aria-labelledby': this.genLabelledBy(item),
          role: 'option'
        },
        on: {
          mousedown: function mousedown(e) {
            // Prevent onBlur from being called
            e.preventDefault();
          },
          click: function click() {
            return disabled || _this3.$emit('select', item);
          }
        },
        props: {
          activeClass: this.tileActiveClass,
          disabled: disabled,
          ripple: true,
          inputValue: value
        }
      };

      if (!this.$scopedSlots.item) {
        return this.$createElement(_VList.VListItem, tile, [this.action && !this.hideSelected && this.items.length > 0 ? this.genAction(item, value) : null, this.genTileContent(item)]);
      }

      var parent = this;
      var scopedSlot = this.$scopedSlots.item({
        parent: parent,
        item: item,
        attrs: _objectSpread({}, tile.attrs, {}, tile.props),
        on: tile.on
      });
      return this.needsTile(scopedSlot) ? this.$createElement(_VList.VListItem, tile, scopedSlot) : scopedSlot;
    },
    genTileContent: function genTileContent(item) {
      var innerHTML = this.genFilteredText(this.getText(item));
      return this.$createElement(_VList.VListItemContent, [this.$createElement(_VList.VListItemTitle, {
        attrs: {
          id: this.genLabelledBy(item)
        },
        domProps: {
          innerHTML: innerHTML
        }
      })]);
    },
    hasItem: function hasItem(item) {
      return this.parsedItems.indexOf(this.getValue(item)) > -1;
    },
    needsTile: function needsTile(slot) {
      return slot.length !== 1 || slot[0].componentOptions == null || slot[0].componentOptions.Ctor.options.name !== 'v-list-item';
    },
    getDisabled: function getDisabled(item) {
      return Boolean((0, _helpers.getPropertyFromItem)(item, this.itemDisabled, false));
    },
    getText: function getText(item) {
      return String((0, _helpers.getPropertyFromItem)(item, this.itemText, item));
    },
    getValue: function getValue(item) {
      return (0, _helpers.getPropertyFromItem)(item, this.itemValue, this.getText(item));
    }
  },
  render: function render() {
    var children = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        if (this.hideSelected && this.hasItem(item)) continue;
        if (item == null) children.push(this.genTile(item));else if (item.header) children.push(this.genHeader(item));else if (item.divider) children.push(this.genDivider(item));else children.push(this.genTile(item));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    children.length || children.push(this.$slots['no-data'] || this.staticNoDataTile);
    this.$slots['prepend-item'] && children.unshift(this.$slots['prepend-item']);
    this.$slots['append-item'] && children.push(this.$slots['append-item']);
    return this.$createElement('div', {
      staticClass: 'v-select-list v-card',
      class: this.themeClasses
    }, [this.$createElement(_VList.VList, {
      attrs: {
        id: this.$attrs.id,
        role: 'listbox',
        tabindex: -1
      },
      props: {
        dense: this.dense
      }
    }, children)]);
  }
});

exports.default = _default2;
//# sourceMappingURL=VSelectList.js.map