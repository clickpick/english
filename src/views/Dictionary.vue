<template>
  <div class="view dictionary" v-on="listeners">
    <div class="overscroll" ref="overscroll" :style="{ transform }">
      <div class="pull caption-small">Следующее слово {{ nextLesson }}</div>
      <div class="scroll" :class="{ 'scroll--force': $isIOS }">
        <template v-if="prepared">
          <list ref="list" :from="from" :reversed="true" @ready="animate" @fail="failLearn" />
          <template v-if="limited">
            <tappable class="list--action" @click="next">Предыдущие</tappable>
          </template>
        </template>
        <list ref="about" from="/about" :custom="true" @ready.once="prepare" @fail="failAbout" />
      </div>
    </div>
    <alert @confirm="allowMessages" @cancel="disallowMessages" ref="alert">
      <span>Мы будем отправлять тебе слова в диалог с ботом. Ты не хочешь получать их?</span>
      <template #cancel>Нет</template>
      <template #confirm>Хочу</template>
    </alert>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as config from '@/model/app';
import Alert from '@/components/Alert';
import { getUTCOffset, getRelative, getRelativeString, minute, parse } from '@/api/date';
import { ruber, virtual } from '@/api/pull';

export default {
  name: 'ViewDictionary',
  components: {
    [Alert.name]: Alert,
    'list': async () => import(/* webpackChunkName: "components" */ '@/components/List'),
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  data() {
    return {
      listeners: null,
      blocks: [],
      nextLesson: 'скоро',
      dayOffset: 0,
      limited: false
    };
  },
  computed: {
    ...mapState({
      prepared: (state) => state.settings.is_ready
    }),
    transform() {
      // HACK for updates
      return `translateY(${this.$_transform}px)`;
    },
    from() {
      return `/learned?day_offset=${this.dayOffset}&day_limit=${config.LOAD_LIMIT_BY}`;
    }
  },
  watch: {
    prepared: {
      handler(value) {
        if (value) {
          this.updateTime();
        }
      },
      immediate: true
    }
  },
  created() {
    this.$_callback = null;
    this.$_transform = 0;
    this.$_swipe = false;
    this.$_identifier = null;
    this.$_touch = false;
    this.$_time = 0;
    this.$_start = 0;
    this.$_down = 0;
  },
  mounted() {
    if (process.client || process.browser) {
      if (this.$isIOS) {
        return;
      }

      this.$_touch =
        navigator.maxTouchPoints > 0 ||
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch);
      if (this.$_touch) {
        this.listeners = {
          '&touchstart': this.startPull,
          '&touchmove': this.pull,
          '&touchend': this.endPull,
          '&touchcancel': this.endPull
        };
        return;
      }
      if (window.navigator.pointerEnabled || window.PointerEvent) {
        this.listeners = {
          '&pointerdown': this.startPull,
          '&pointermove': this.pull,
          '&pointerup': this.endPull,
          '&pointercancel': this.endPull,
          '&pointerleave': this.endPull
        };
        return;
      }
      this.listeners = {
        '&mousedown': this.startPull,
        '&mousemove': this.pull,
        '&mouseup': this.endPull,
        '&mouseleave': this.endPull
      };
    }
  },
  methods: {
    next() {
      requestAnimationFrame(() => {
        this.dayOffset += config.LOAD_LIMIT_BY;
      });
    },
    async failLearn() {
      this.$store.dispatch('notify', '🤷‍♂️ Слова куда-то пропали...');
    },
    async failAbout() {
      this.$store.dispatch('notify', '🙃 Бывает же такое...');
    },
    async updateTime() {
      return this.$axios.get('/me/next-lesson').then((response) => {
        let nextAt = response.data.data.send_at;
        if (nextAt) {
          nextAt = +(parse(nextAt)) + getUTCOffset() * minute;

          const timer = setInterval(() => {
            update();
          }, minute);

          const update = () => {
            const relative = getRelative(nextAt);
            if (relative.ml > 0) {
              this.nextLesson = getRelativeString(relative);
            } else {
              clearInterval(timer);
              this.$refs.list.load().then(() => {
                this.updateTime();
              });
            }
          };

          update();
        } else {
          setTimeout(() => {
            this.updateTime();
          }, 1000);
        }
      }).catch(() => {
        this.nextLesson = 'скоро';
      });
    },
    async animate() {
      const { lists } = this.$refs.list;
      this.limited = lists.length && lists[lists.length - 1].day_num != 1;
      await this.$nextTick();
      this.$refs.list.all();
    },
    prepare() {
      requestAnimationFrame(async () => {
        if (this.prepared) {
          this.$refs.about.all();
          return;
        } else {
          await this.$refs.about.next();
          await this.$nextTick();
          await this.$refs.about.next();
          await this.$nextTick();
          await this.requestWaitAllowMessages();
          await this.allowMessages();
          await this.$nextTick();
          await this.$refs.about.next();
          await this.$nextTick();
          await this.waitSettings();
          await this.$nextTick();
          await this.$refs.about.next();
          await this.$nextTick();
          await this.setReady();
          await this.$nextTick();
          await this.$refs.about.next();
        }
      });
    },
    async allowMessages() {
      return new Promise((callback) => {
        this.$api.allowCommunityMessages(config.GROUP_ID, config.GROUP_ALLOW_MESSAGES).then(() => {
          callback();
        }).catch((e) => {
          if (
            e.error_data &&
            e.error_data.error_reason &&
            String(e.error_data.error_reason).toLowerCase() === 'user denied'
          ) {
            if (this.$_callback) {
              this.$_callback();
              callback();
              return;
            }
            this.$_callback = callback;
            if (this._isMounted) {
              this.$refs.alert.show();
            }
          } else {
            if (this.$_callback) {
              this.$_callback();
              callback();
              return;
            }
          }
        });
      });
    },
    async disallowMessages() {
      if (this.$_callback) {
        this.$_callback();
      }
    },
    async waitSettings() {
      return new Promise((callback) => {
        this.$bus.$once('view:settings', () => {
          this.$bus.$once('view:dictionary', () => {
            callback();
          });
        });
      });
    },
    async setReady() {
      await this.$store.commit('SETTINGS_IS_READY', true);
    },
    startPull(e) {
      if (!this.prepared) {
        return;
      }
      if (document.body.scrollTop > 0) {
        return;
      }
      if (this.$_swipe) {
        return;
      }
      this.$_swipe = true;
      this.$_time = +(new Date());
      if (this.$_touch) {
        const touch = e.changedTouches[0];
        this.$_identifier = touch.identifier;
        this.$_down = touch.pageY;
        this.$_start = touch.pageY - this.$_transform;
      } else {
        this.$_down = e.pageY;
        this.$_start = e.pageY - this.$_transform;
      }
      requestAnimationFrame(() => {
        this.$refs.overscroll.classList.remove('overscroll--animate');
      });
    },
    pull(e) {
      if (this.$_swipe) {
        if (e.stopPropogation) {
          e.stopPropogation();
        }
        if (this.$_touch) {
          const touches = e.changedTouches;
          for (let i = 0; i < touches.length; ++i) {
            if (touches[i].identifier === this.$_identifier) {
              this.apply(touches[i].pageY - this.$_down);
              return;
            }
          }
        } else {
          this.apply(e.pageY - this.$_down);
        }
      }
    },
    endPull(e) {
      if (!this.$_swipe) {
        return;
      }
      this.$_swipe = false;
      if (e.stopPropogation) {
        e.stopPropogation();
      }
      requestAnimationFrame(() => {
        if (this._isMounted) {
          this.$refs.overscroll.classList.add('overscroll--animate');
          this.apply(0);
        }
      });
      // TODO
    },
    apply(px) {
      requestAnimationFrame(() => {
        if (this._isMounted) {
          if (px < 0) {
            px = 0;
          }
          const real = window.innerHeight * 2 / 3 - virtual - 48 - 22;
          if (px > real) {
            px = real;
          }
          px = ruber(px / real) * virtual;
          if (px > virtual) {
            px = virtual;
          }
          this.$refs.overscroll.style.transform = `translateY(${px}px)`;
          this.$_transform = px;
        } else {
          this.$_transform = 0;
        }
      });
    },
    async requestWaitAllowMessages() {
      return new Promise((callback) => {
        setTimeout(() => {
          callback();
        }, 600);
      });
    }
  }
};
</script>

<style lang="scss">
.dictionary {
  &__block {
    margin-bottom: 16px;
  }

  .overscroll {
    margin-top: -140px;
    transform: translateY(0px);
    backface-visibility: hidden;
    will-change: transform;

    &--animate {
      transition: transform 0.3s ease-out;
    }
  }

  .scroll {
    @media (min-width: 530px) {
      padding-bottom: 22px;
    }

    &--force {
      min-height: calc(100vh - 70px);
      min-height: calc(
        100vh - 70px - var(--safe-area-inset-bottom) -
          var(--safe-area-inset-top)
      );
    }
  }

  .pull {
    width: 100%;
    height: 140px;
    padding-right: 100px;
  }
}
</style>
