// Styles
import "../../../src/components/VRangeSlider/VRangeSlider.sass"; // Components

import VSlider from '../VSlider'; // Helpers

import { createRange, deepEqual } from '../../util/helpers';
/* @vue/component */

export default VSlider.extend({
  name: 'v-range-slider',
  props: {
    value: {
      type: Array,
      default: () => [0, 0]
    }
  },

  data() {
    return {
      activeThumb: null,
      lazyValue: this.value
    };
  },

  computed: {
    classes() {
      return { ...VSlider.options.computed.classes.call(this),
        'v-input--range-slider': true
      };
    },

    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        // Round value to ensure the
        // entire slider range can
        // be selected with step
        let value = val.map(v => this.roundValue(Math.min(Math.max(v, this.minValue), this.maxValue))); // Switch values if range and wrong order

        if (value[0] > value[1] || value[1] < value[0]) {
          if (this.activeThumb !== null) {
            const toFocus = this.activeThumb === 1 ? 0 : 1;
            const el = this.$refs[`thumb_${toFocus}`];
            el.focus();
          }

          value = [value[1], value[0]];
        }

        this.lazyValue = value;
        if (!deepEqual(value, this.value)) this.$emit('input', value);
        this.validate();
      }

    },

    inputWidth() {
      return this.internalValue.map(v => (this.roundValue(v) - this.minValue) / (this.maxValue - this.minValue) * 100);
    },

    trackFillStyles() {
      const styles = VSlider.options.computed.trackFillStyles.call(this);
      const fillPercent = Math.abs(this.inputWidth[0] - this.inputWidth[1]);
      const dir = this.vertical ? 'height' : 'width';
      const start = this.vertical ? this.$vuetify.rtl ? 'top' : 'bottom' : this.$vuetify.rtl ? 'right' : 'left';
      styles[dir] = `${fillPercent}%`;
      styles[start] = `${this.inputWidth[0]}%`;
      return styles;
    }

  },
  methods: {
    getTrackStyle(startLength, endLength, startPadding = 0, endPadding = 0) {
      const startDir = this.vertical ? this.$vuetify.rtl ? 'top' : 'bottom' : this.$vuetify.rtl ? 'right' : 'left';
      const endDir = this.vertical ? 'height' : 'width';
      const start = `calc(${startLength}% + ${startPadding}px)`;
      const end = `calc(${endLength}% + ${endPadding}px)`;
      return {
        transition: this.trackTransition,
        [startDir]: start,
        [endDir]: end
      };
    },

    getIndexOfClosestValue(arr, v) {
      if (Math.abs(arr[0] - v) < Math.abs(arr[1] - v)) return 0;else return 1;
    },

    genInput() {
      return createRange(2).map(i => {
        const input = VSlider.options.methods.genInput.call(this);
        input.data = input.data || {};
        input.data.attrs = input.data.attrs || {};
        input.data.attrs.value = this.internalValue[i];
        return input;
      });
    },

    genTrackContainer() {
      const children = [];

      if (this.disabled) {
        const disabledPadding = 10;
        const sections = [[0, this.inputWidth[0], 0, -disabledPadding], [this.inputWidth[0], Math.abs(this.inputWidth[1] - this.inputWidth[0]), disabledPadding, disabledPadding * -2], [this.inputWidth[1], Math.abs(100 - this.inputWidth[1]), disabledPadding, 0]];
        if (this.$vuetify.rtl) sections.reverse();
        children.push(...sections.map(section => this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
          staticClass: 'v-slider__track-background',
          style: this.getTrackStyle(...section)
        }))));
      } else {
        children.push(this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
          staticClass: 'v-slider__track-background',
          style: this.getTrackStyle(0, 100)
        })), this.$createElement('div', this.setBackgroundColor(this.computedColor, {
          staticClass: 'v-slider__track-fill',
          style: this.trackFillStyles
        })));
      }

      return this.$createElement('div', {
        staticClass: 'v-slider__track-container',
        ref: 'track'
      }, children);
    },

    genChildren() {
      return [this.genInput(), this.genTrackContainer(), this.genSteps(), createRange(2).map(index => {
        const value = this.internalValue[index];

        const onDrag = e => {
          this.isActive = true;
          this.activeThumb = index;
          this.onThumbMouseDown(e);
        };

        const onFocus = e => {
          this.isFocused = true;
          this.activeThumb = index;
          this.$emit('focus', e);
        };

        const onBlur = e => {
          this.isFocused = false;
          this.activeThumb = null;
          this.$emit('blur', e);
        };

        const valueWidth = this.inputWidth[index];
        const isActive = this.isActive && this.activeThumb === index;
        const isFocused = this.isFocused && this.activeThumb === index;
        return this.genThumbContainer(value, valueWidth, isActive, isFocused, onDrag, onFocus, onBlur, `thumb_${index}`);
      })];
    },

    onSliderClick(e) {
      if (!this.isActive) {
        if (this.noClick) {
          this.noClick = false;
          return;
        }

        const {
          value,
          isInsideTrack
        } = this.parseMouseMove(e);

        if (isInsideTrack) {
          this.activeThumb = this.getIndexOfClosestValue(this.internalValue, value);
          const refName = `thumb_${this.activeThumb}`;
          const thumbRef = this.$refs[refName];
          thumbRef.focus();
        }

        this.setInternalValue(value);
        this.$emit('change', this.internalValue);
      }
    },

    onMouseMove(e) {
      const {
        value,
        isInsideTrack
      } = this.parseMouseMove(e);

      if (isInsideTrack && this.activeThumb === null) {
        this.activeThumb = this.getIndexOfClosestValue(this.internalValue, value);
      }

      this.setInternalValue(value);
    },

    onKeyDown(e) {
      if (this.activeThumb === null) return;
      const value = this.parseKeyDown(e, this.internalValue[this.activeThumb]);
      if (value == null) return;
      this.setInternalValue(value);
      this.$emit('change', this.internalValue);
    },

    setInternalValue(value) {
      this.internalValue = this.internalValue.map((v, i) => {
        if (i === this.activeThumb) return value;else return Number(v);
      });
    }

  }
});
//# sourceMappingURL=VRangeSlider.js.map