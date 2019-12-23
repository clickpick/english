<template>
  <div class="list--block">
    <transition name="list-loader">
      <template v-if="loading">
        <div class="list--load">
          <span class="list--load__dot" />
        </div>
      </template>
    </transition>
    <div class="list" v-for="(list, offset) in lists" :key="list.day_num">
      <div class="list-caption caption-small" v-text="getCaption(list)" />
      <div class="list-flow" :class="{ 'list-flow--reversed': reversed }">
        <card
          v-for="(model, index) in list.phrases"
          :key="model.id"
          :model="model"
          :visible="isVisible(offset, index)"
          :lazy="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';
import unionWith from 'lodash-es/unionWith';

const isEquals = function isEquals(l1, l2) {
  return l1.day_num === l2.day_num;
};

export default {
  name: 'List',
  components: {
    'card': async () => import(/* webpackChunkName: "components" */ '@/components/Card'),
  },
  props: {
    custom: {
      type: Boolean,
      default: false
    },
    reversed: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      showed: -1,
      lists: []
    };
  },
  computed: {
    view() {
      return this.lists.reduce((acc, list) => {
        acc.offsets.push(acc.count);
        acc.count += list.phrases.length;
        return acc;
      }, {
        count: 0,
        offsets: []
      });
    }
  },
  watch: {
    from: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (this.loading) {
            const dispatch = this.$watch('loading', (value) => {
              if (!value) {
                this.load();

                if (dispatch) {
                  dispatch();
                }
              }
            });
          } else {
            this.load();
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    async load() {
      const timer = setTimeout(() => {
        this.loading = true;
      }, 2000);

      return this.$axios.get(this.from).then((response) => {
        clearTimeout(timer);

        this.lists = filter(unionWith(this.lists, response.data.data, isEquals), (list) => {
          return !isEmpty(list);
        });

        if (this._isMounted) {
          this.emitReady();
        } else {
          this.$once('hook:mounted', () => {
            this.emitReady();
          });
        }

        this.loading = false;
      }).catch((e) => {
        clearTimeout(timer);

        this.loading = false;
        this.$emit('fail', e);
      });
    },
    async next(immediate = false) {
      return new Promise((callback) => {
        requestAnimationFrame(() => {
          ++this.showed;
          this.$nextTick(() => { // update hook
            requestAnimationFrame(() => { // update dom
              if (immediate) {
                callback();
              } else {
                setTimeout(() => { // animation
                  requestAnimationFrame(() => { // next frame
                    this.$nextTick(() => { // update hook
                      requestAnimationFrame(() => { // update dom
                        callback();
                      });
                    });
                  });
                }, 300);
              }
            });
          });
        });
      });
    },
    async flush() {
      if (this.showed < this.view.count) {
        await this.next(false);
        await this.flush();
      }
    },
    async all() {
      if (this.showed < this.view.count) {
        await this.next(true);
        await this.all();
      }
    },
    getCaption(model) {
      return this.custom ? model.day_num : `День ${model.day_num}`;
    },
    isVisible(offset, index) {
      return (this.view.offsets[offset] + index) <= this.showed;
    },
    emitReady() {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.$emit('ready');
        });
      });
    }
  }
};
</script>

<style lang="scss">
.list {
  position: relative;
  overflow: visible;

  &-flow {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;

    &--reversed {
      flex-direction: column-reverse;
    }
  }

  &--load {
    height: 20px;
    text-align: center;

    &:before,
    &:after {
      content: "";
    }

    &:before,
    &:after,
    &__dot {
      display: inline-block;
      border-radius: 999em;
      width: 4px;
      height: 4px;
      margin: 0 1px 8px 1px;
      background-color: #fff;
      opacity: 0.2;
      animation: blink 0.75s linear infinite;
    }

    &:before {
      animation-delay: 0s;
    }

    &__dot {
      animation-delay: 0.18s;
    }

    &:after {
      animation-delay: 0.36s;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  0% {
    opacity: 0.2;
  }
}

.list-loader-enter-active,
.list-loader-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
}

.list-loader-leave,
.list-loader-enter-to {
  opacity: 1;
  max-height: 20px;
}

.list-loader-enter,
.list-loader-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
