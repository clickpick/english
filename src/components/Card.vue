<template>
  <tappable
    class="card"
    :class="{ 'card--interactive': interactive, 'card--visible': visible, 'card--active': active }"
    @click="speak"
  >
    <div class="card__title" v-text="model.native" />
    <div class="card__body" v-text="model.translation" />
  </tappable>
</template>

<script>
export default {
  name: 'Card',
  components: {
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false,
      interactive: false
    };
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          if (this.lazy) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                requestAnimationFrame(() => {
                  this.interactive = true;
                });
              }, 300);
            });
          } else {
            this.interactive = true;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    async speak() {
      if (this.active) {
        return;
      }
      this.active = true;
      this.$speech.speak(this.model).then(() => {
        requestAnimationFrame(() => {
          this.reset();
        });
      }).catch(() => {
        this.reset();
        this.$store.dispatch('notify', 'Не удалось воспроизвести');
      });
    },
    reset() {
      if (this._isMounted) {
        this.active = false;
      } else {
        this.$once('hook:mounted', () => {
          this.active = false;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.card {
  display: block;

  width: calc(100% + 28px);

  margin-left: -14px;
  margin-right: -14px;
  margin-bottom: 8px;

  padding: 14px;
  border-radius: 14px;

  text-align: left;

  color: #fff;
  background-color: #2a2b2c;

  transform: translateY(-8px) scale(0.95);
  opacity: 0;

  pointer-events: none;
  transition-delay: 1s;

  &--visible {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  &--interactive {
    pointer-events: all;
    transition-delay: 0s;
  }

  &--active {
    transform: scale(1.02);
    background-color: #434546;
  }

  &__title {
    font-size: 14pt;
    margin-bottom: 4px;
  }

  &__body {
    font-weight: 300;
    font-size: 12pt;
    color: #ccc;
  }
}

html[theme="light"] {
  .card {
    color: #212121;
    background-color: #f6f7f8;

    &__body {
      color: #212121;
    }

    &--active {
      background-color: #ebecef;
    }
  }
}
</style>
