<template>
  <div class="view achive">
    <div class="achive__row">
      <div class="achive__column">
        <tappable
          class="achive__icon"
          :disabled="!achive.completed.is_achieved"
          @click="check('completed')"
        >🎓</tappable>
        <tappable
          class="achive__icon"
          :disabled="!achive.start.is_achieved"
          @click="check('start')"
        >🎬</tappable>
        <tappable
          class="achive__icon"
          :disabled="!achive.clever.is_achieved"
          @click="check('clever')"
        >📚</tappable>
      </div>
      <div class="achive__column">
        <tappable class="achive__icon" :disabled="!achive.bot.is_achieved" @click="check('bot')">🏷️</tappable>
        <tappable
          class="achive__icon"
          :disabled="!achive.month.is_achieved"
          @click="check('month')"
        >📅</tappable>
        <tappable
          class="achive__icon"
          :disabled="!achive.notified.is_achieved"
          @click="check('notified')"
        >🔥</tappable>
      </div>
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
  }

  &__description {
    font-size: 12pt;
    font-weight: 300;
  }

  &__row,
  &__column {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: stretch;
  }

  &__row {
    flex-direction: row;

    min-height: calc(100vh - 92px);
    min-height: calc(
      100vh - 92px - var(--safe-area-inset-top) - var(--safe-area-inset-bottom)
    );
    @media (min-width: 530px) {
      min-height: calc(100vh - 136px);
      min-height: calc(
        100vh - 136px - var(--safe-area-inset-top) -
          var(--safe-area-inset-bottom)
      );
    }
  }

  &__column {
    flex-direction: column;
  }

  &__column {
    &:first-child {
      margin-bottom: 48px;
      margin-right: 8px;
    }

    &:last-child {
      margin-top: 48px;
      margin-left: 8px;
    }
  }

  &__icon {
    font-size: calc(48vw - 60px);
    @media (min-width: 530px) {
      font-size: calc(48vw - 104px);
    }
    margin: 16px 0;

    filter: grayscale(1) brightness(0.6);
    transition: filter 0.3s ease;

    &:not(:disabled) {
      filter: grayscale(0) brightness(1);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
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
