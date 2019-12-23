<template>
  <div class="view achive">
    <div class="achive__row">
      <tappable
        class="achive__icon"
        :disabled="!achive.completed.is_achieved"
        @click="check('completed')"
      >
        🎓
        <span class="achive__name  achive__name--small">{{achive.completed.name}}</span>
      </tappable>
      <tappable
        class="achive__icon"
        :disabled="!achive.start.is_achieved"
        @click="check('start')"
      >
        🎬
        <span class="achive__name  achive__name--small">{{achive.start.name}}</span>
      </tappable>
      <tappable
        class="achive__icon"
        :disabled="!achive.clever.is_achieved"
        @click="check('clever')"
      >
        📚
        <span class="achive__name  achive__name--small">{{achive.clever.name}}</span>
      </tappable>
      <tappable
        class="achive__icon"
        :disabled="!achive.bot.is_achieved"
        @click="check('bot')"
      >
        🏷️
        <span class="achive__name  achive__name--small">{{achive.bot.name}}</span>
      </tappable>
      <tappable
        class="achive__icon"
        :disabled="!achive.month.is_achieved"
        @click="check('month')"
      >
        📅
        <span class="achive__name  achive__name--small">{{achive.month.name}}</span>
      </tappable>
      <tappable
        class="achive__icon"
        :disabled="!achive.notified.is_achieved"
        @click="check('notified')"
      >
        🔥
        <span class="achive__name  achive__name--small">{{achive.notified.name}}</span>
      </tappable>
    </div>
    <transition name="fade">
      <keep-alive>
        <template v-if="current">
          <alert ref="alert" @confirm="_clear" @cancel="_clear" :show-cancel="false">
            <div class="achive__name" v-text="current.name" />
            <div class="achive__description" v-text="current.description" />
            <template #confirm>Потрясающе</template>
          </alert>
        </template>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import Alert from '@/components/Alert';

export default {
  name: 'ViewAchieve',
  components: {
    [Alert.name]: Alert,
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  data() {
    return {
      current: null,
      achive: {
        completed: {
          is_achieved: false
        },
        start: {
          is_achieved: false
        },
        clever: {
          is_achieved: false
        },
        bot: {
          is_achieved: false
        },
        month: {
          is_achieved: false
        },
        notified: {
          is_achieved: false
        }
      }
    };
  },
  created() {
    this.load();
  },
  watch: {
    current(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.alert.show();
        });
      }
    }
  },
  methods: {
    _clear() {
      this.current = null;
    },
    async load() {
      return this.$axios.get('/me/achievements').then((response) => {
        this.achive = response.data.data.reduce((acc, achive) => {
          acc[achive.slug] = achive;
          return acc;
        }, {});
      });
    },
    check(slug) {
      if (this.achive[slug].is_achieved) {
        this.current = this.achive[slug];
      }
    }
  }
};
</script>

<style lang="scss">
.achive {
  &__name {
    font-size: 14pt;
    margin-bottom: 4px;

    &--small {
      display: inline-block;

      min-height: 36px;
      margin-top: 10px;

      font-size: 11pt;
      color: #fff;
    }
  }

  &__description {
    font-size: 12pt;
    font-weight: 300;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  &__icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    width: 33%;
    @media (max-width: 375px) {
      width: 50%;
    }

    margin: 16px 0;

    font-size: 90px;

    filter: grayscale(1) brightness(0.6);
    transition: all 0.3s ease;

    &:not(:disabled) {
      filter: grayscale(0) brightness(1);
    }

    &__name {
      font-size: 13px;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

html[theme="light"] {
  .achive {
    &__name {
      &--small {
        color: #000;
      }
    }

    &__icon {
      filter: grayscale(1) contrast(0.4) brightness(1.5);

      &:not(:disabled) {
        filter: grayscale(0) contrast(1) brightness(1);
      }
    }
  }
}
</style>
