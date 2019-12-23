<template>
  <div class="hello">
    <div class="hello__block">
      <div class="caption-small">Я изучаю</div>
      <div class="caption-big">English</div>
    </div>
    <div class="hello__block">
      <div class="caption-small">Через</div>
      <div class="caption-big">Русский</div>
    </div>
    <list ref="list" from="/demo" @ready.once="animate" :custom="true" />
    <div class="hello__start">
      <tappable @click="start">Начать обучение</tappable>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Onboard',
  components: {
    'list': async () => import(/* webpackChunkName: "components" */ '@/components/List'),
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  computed: {
    ...mapState({
      is_active: (state) => state.settings.is_active,
      is_ready: (state) => state.settings.is_ready
    })
  },
  watch: {
    is_active: {
      handler(value) {
        if (value) {
          this.$router.replace({ path: '/' });
        }
      },
      immediate: true
    },
    is_ready: {
      handler(value) {
        if (value) {
          this.$router.replace({ path: '/' });
        }
      },
      immediate: true
    }
  },
  methods: {
    animate() {
      requestAnimationFrame(() => {
        this.$refs.list.flush();
      });
    },
    async start() {
      await this.$store.dispatch('start');
    }
  }
};
</script>

<style lang="scss">
.hello {
  padding-bottom: 100px;
  padding-bottom: calc(100px + var(--safe-area-inset-bottom));

  &__block {
    margin-bottom: 60px;
  }

  &__start {
    position: fixed;
    bottom: 22px;
    bottom: calc(22px + var(--safe-area-inset-bottom));
    left: 22px;
    right: 22px;

    @media (min-width: 530px) {
      left: 44px;
      right: 44px;
    }

    .tappable {
      background-color: #fff;
      display: block;
      width: 100%;
      text-transform: uppercase;
      color: #000;
      padding: 20px 0;
      border-radius: 14px;
      font-size: 12pt;
      font-weight: 500;
    }
  }
}

html[theme="light"] {
  .hello {
    &__start {
      .tappable {
        background-color: #f6f7f8;
      }
    }
  }
}

.custom-scroll {
  &.animate-ready {
    .hello {
      &__start {
        right: 30px;
        @media (min-width: 530px) {
          right: 52px;
        }
      }
    }
  }
}
</style>
