<template>
  <div class="picker" v-on="listeners">
    <ul class="picker__wrapper" ref="wrapper" v-once>
      <li
        v-for="num in count"
        :key="from + num - 1"
        ref="value"
        class="picker__value"
        v-text="from + num - 1"
      />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Picker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    from: {
      type: Number,
      default: 0
    },
    to: {
      type: Number,
      default: 24
    }
  },
  data() {
    return {
      listeners: null,
      points: []
    };
  },
  computed: {
    count() {
      return this.to - this.from + 1;
    }
  },
  created() {
    this.$_transform = 0;
    this.$_swipe = false;
    this.$_identifier = null;
    this.$_touch = false;
    this.$_time = 0;
    this.$_start = 0;
    this.$_down = 0;

    if (process.client || process.browser) {
      this.$_touch =
        navigator.maxTouchPoints > 0 ||
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch);
      if (this.$_touch) {
        this.listeners = {
          '&touchstart': this.start,
          '&touchmove': this.move,
          '&touchend': this.end,
          '&touchcancel': this.end
        };
        return;
      }
      if (window.navigator.pointerEnabled || window.PointerEvent) {
        this.listeners = {
          '&pointerdown': this.start,
          '&pointermove': this.move,
          '&pointerup': this.end,
          '&pointercancel': this.end,
          '&pointerleave': this.end
        };
        return;
      }
      this.listeners = {
        '&mousedown': this.start,
        '&mousemove': this.move,
        '&mouseup': this.end,
        '&mouseleave': this.end
      };
    }
  },
  mounted() {
    let current = 0;
    this.points = this.$refs.value.reduce((acc, el) => {
      acc.left.push(-current);
      acc.center.push(-(current + el.offsetWidth / 2));
      current += el.offsetWidth + 10;
      return acc;
    }, {
      left: [],
      center: []
    });
    this.$_total = this.$refs.value.length - 1;
    this.$_last = this.$refs.value[this.$_total];
    this.apply(this.points.left[this.value - this.from]);
  },
  methods: {
    start(e) {
      if (this.$_swipe) {
        return;
      }
      this.$_swipe = true;
      this.$_time = +(new Date());
      if (this.$_touch) {
        const touch = e.changedTouches[0];
        this.$_identifier = touch.identifier;
        this.$_down = touch.pageX;
        this.$_start = touch.pageX - this.$_transform;
      } else {
        this.$_down = e.pageX;
        this.$_start = e.pageX - this.$_transform;
      }
      requestAnimationFrame(() => {
        this.$refs.wrapper.classList.remove('picker__wrapper--animate');
      });
    },
    move(e) {
      if (this.$_swipe) {
        if (this.$_touch) {
          const touches = e.changedTouches;
          for (let i = 0; i < touches.length; ++i) {
            if (touches[i].identifier === this.$_identifier) {
              this.apply(touches[i].pageX - this.$_start);
              return;
            }
          }
        } else {
          this.apply(e.pageX - this.$_start);
        }
      }
    },
    end(e) {
      if (!this.$_swipe) {
        return;
      }
      this.$_swipe = false;
      requestAnimationFrame(() => {
        if (this._isMounted) {
          this.$refs.wrapper.classList.add('picker__wrapper--animate');
          const delta = e.pageX - this.$_down;
          if (delta === 0) {
            return;
          }
          const speed = 600;
          const elapsed = +(new Date()) - this.$_time;
          if (Math.abs(delta) > 120 && elapsed < speed) {
            let continuous = (speed - elapsed) / speed / 3 * this.$el.offsetWidth;
            if (delta < 0) {
              continuous *= -1;
            }
            this.$_transform += continuous;
          }
          if (this.$_transform > this.points.center[0]) {
            this.apply(this.points.left[0]);
            this.$emit('change', this.from);
            return;
          }
          if (this.$_transform < this.points.center[this.$_total]) {
            this.apply(this.points.left[this.$_total]);
            this.$emit('change', this.to);
            return;
          }
          if (delta > 0) {
            for (let i = this.$_total; i >= 0; --i) {
              if (this.$_transform < this.points.center[i]) {
                this.apply(this.points.left[i]);
                this.$emit('change', this.from + i);
                return;
              }
            }
          } else {
            for (let i = 0; i <= this.$_total; ++i) {
              if (this.$_transform > this.points.center[i]) {
                this.apply(this.points.left[i]);
                this.$emit('change', this.from + i);
                return;
              }
            }
          }
        }
      });
    },
    apply(px) {
      requestAnimationFrame(() => {
        if (this._isMounted) {
          for (let i = 0; i < this.$_total; ++i) {
            if (px <= this.points.left[i] && px > this.points.left[i + 1]) {
              this.$refs.value[i].classList.add('picker__value--active');
            } else {
              this.$refs.value[i].classList.remove('picker__value--active');
            }
          }
          if (px <= this.points.left[this.$_total]) {
            this.$_last.classList.add('picker__value--active');
          } else {
            this.$_last.classList.remove('picker__value--active');
          }
          this.$refs.wrapper.style.transform = `translateX(${px}px)`;
          this.$_transform = px;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.picker {
  overflow: visible;
  touch-action: pan-x;

  &__wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: center;
    align-items: center;

    transform: translateX(0);
    backface-visibility: hidden;
    will-change: transform;

    &--animate {
      transition: transform 0.3s ease-out;
    }
  }

  &__value {
    white-space: nowrap;
    margin-right: 10px;
    line-height: 1;
    font-size: 64pt;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    flex-grow: 0;
    white-space: nowrap;

    color: #76787a;
    font-weight: 300;
    transform: scale(0.99);
    transform-origin: center;
    transition: color 0.3s ease, transform 0.14s ease-in-out;

    &--active {
      color: #fff;
      transform: scale(1);
    }
  }
}

html[theme="light"] {
  .picker {
    &__value {
      color: #b1b3b4;

      &--active {
        color: #212121;
      }
    }
  }
}
</style>
