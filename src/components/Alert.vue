<template>
  <div
    class="alert"
    v-show="showing"
    @touchmove="_prevent"
    @pointermove="_prevent"
    @click.self="_middleware"
  >
    <div class="alert__wrapper" @mousedown.passive="_capture" @touchstart.passive="_capture">
      <div class="alert__content">
        <slot />
      </div>
      <div class="alert__buttons">
        <template v-if="showCancel">
          <tappable class="cancel" @click="cancel">
            <slot name="cancel">Отмена</slot>
          </tappable>
        </template>
        <template v-if="showConfirm">
          <tappable class="confirm" @click="confirm">
            <slot name="confirm">Ок</slot>
          </tappable>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { prevent } from '@/api/dom';

export default {
  name: 'Alert',
  components: {
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  props: {
    showCancel: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showing: false
    };
  },
  created() {
    this.$_captured = false;
  },
  methods: {
    _prevent: prevent,
    _middleware() {
      if (this.$_captured) {
        return this.$_captured = false;
      }
      this.cancel();
    },
    _capture() {
      this.$_captured = true;
    },
    show() {
      this.showing = true;
    },
    confirm(e) {
      this.showing = false;
      this.$nextTick(() => {
        this.$emit('confirm', e);
      });
    },
    cancel(e) {
      this.showing = false;
      this.$nextTick(() => {
        this.$emit('cancel', e);
      });
    }
  }
};
</script>

<style lang="scss">
.alert {
  position: fixed;
  z-index: 1000;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.4);

  justify-content: center;

  &,
  &__buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
  }

  &__buttons {
    margin-top: 16px;
    justify-content: flex-end;

    .tappable {
      padding: 4px 16px;
      flex-shrink: 0;
      font-weight: 500;
    }
  }

  &__wrapper {
    padding: 20px 24px;
    border-radius: 14px;

    margin: auto 24px;
    min-width: 272px;
    max-width: 382px;

    color: #fff;
    background-color: #2c2d2e;
    box-shadow: 0 20px 35px 0 rgba(0, 0, 0, 0.3), 0 0 35px 0 rgba(0, 0, 0, 0.22);
  }

  .cancel {
    color: #ff4e5f;
  }

  .confirm {
    margin-left: 12px;
    color: #71aaeb;
  }
}

html[theme="light"] {
  .alert {
    &__wrapper {
      color: #212121;
      background-color: #fff;
    }
  }
}
</style>
