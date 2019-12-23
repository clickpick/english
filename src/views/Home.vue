<template>
  <div class="home">
    <keep-alive>
      <view-dictionary v-if="view === 'dictionary'" />
      <view-achieve v-if="view === 'achieve'" />
      <view-settings v-if="view === 'settings'" />
    </keep-alive>
    <div class="notify" :class="{ 'notify--active': hasNotify && notify }" v-text="notify" />
    <div class="tabbar">
      <tabbar-item :selected="view === 'dictionary'" @click="view = 'dictionary'">
        <template #icon>
          <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" v-once>
            <g fill="none" fill-rule="evenodd">
              <path d="M0 0h28v28H0z" />
              <path
                d="M17.6 3c2.2 0 3.2.2 4.3.8 1 .5 1.8 1.3 2.3 2.3.6 1 .8 2.1.8 4.3v7.2c0 2.2-.2 3.2-.8 4.3-.5 1-1.3 1.8-2.3 2.3-1 .6-2.1.8-4.3.8h-7.2c-2.2 0-3.2-.2-4.3-.8-1-.5-1.8-1.3-2.3-2.3-.6-1-.8-2.1-.8-4.3v-7.2c0-2.2.2-3.2.8-4.3C4.3 5 5 4.3 6 3.8c1-.6 2.1-.8 4.3-.8h7.2zm0 2h-7.2c-1.9 0-2.6.1-3.4.5C6.4 6 6 6.4 5.5 7c-.4.8-.5 1.5-.5 3.4v7.2c0 1.9.1 2.6.5 3.4.4.6.9 1.1 1.5 1.5.8.4 1.5.5 3.4.5h7.2c1.9 0 2.6-.1 3.4-.5.6-.4 1.1-.9 1.5-1.5.4-.8.5-1.5.5-3.4v-7.2c0-1.9-.1-2.6-.5-3.4-.4-.6-.9-1.1-1.5-1.5-.8-.4-1.5-.5-3.4-.5zM13 17.5a1 1 0 010 2H9a1 1 0 010-2zM9 13h10a1 1 0 01.1 2H9a1 1 0 01-.1-2H19zm10-4.5a1 1 0 01.1 2H9a1 1 0 01-.1-2H19z"
                fill="currentColor"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        </template>
        <span>Словарь</span>
      </tabbar-item>
      <tabbar-item :selected="view === 'achieve'" @click="view = 'achieve'">
        <template #icon>
          <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" v-once>
            <g fill="none" fill-rule="evenodd">
              <path d="M0 0h28v28H0z" />
              <path
                d="M13.71 1.53c.74.17 1.2.9 1.04 1.65-.08.34-.18.62-.34.86-2.16 3.34-1.8 5.54-.37 5.75 1.41.2 2.2-.7 1.97-2.79l-.13-1.25a1.34 1.34 0 012.08-1.26c.74.5 1.58 1.33 2.53 2.52 2.7 3.38 3.55 6.33 3.5 9.36C23.94 22 19.74 26 14 26S4 21.98 4 16.35c.03-4.98 2.74-10.4 7.81-14.01l.78-.57c.32-.24.73-.32 1.12-.24zm-2.08 3.5C7.96 8.2 6.03 12.45 6 16.34 6 20.85 9.33 24 14 24c4.65 0 7.94-3.13 8-7.66.03-2.6-.68-5.1-3.07-8.08-.32-.4-.62-.75-.9-1.04.17 3.06-1.6 4.94-4.28 4.55-2.7-.4-3.58-3.25-2.12-6.75z"
                fill="currentColor"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        </template>
        <span>Награды</span>
      </tabbar-item>
      <tabbar-item :selected="view === 'settings'" @click="view = 'settings'">
        <template #icon>
          <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" v-once>
            <g fill-rule="nonzero" fill="none">
              <path d="M0 0h28v28H0z" />
              <path
                d="M15.15 2.04c.43.07.83.23 1.2.52.59.48.87 1.08 1.09 1.95.06.23.15.5.27.74.28.12.55.25.82.4.26-.07.51-.15.71-.25 1.42-.65 2.6-.62 3.57.43l.24.28.63.77c.17.21.24.3.35.49.69 1.15.42 2.22-.46 3.38-.14.2-.29.45-.41.71l.2.86c.21.18.45.34.66.44.8.41 1.33.82 1.66 1.51.2.42.26.85.24 1.28-.02.23-.04.36-.11.64l-.23.98c-.06.28-.1.4-.18.62-.16.4-.41.76-.78 1.05-.6.47-1.24.61-2.15.63-.23 0-.5.04-.77.1-.18.24-.36.47-.56.7 0 .27.03.54.07.76.2.89.2 1.55-.13 2.24-.2.42-.49.74-.84 1-.19.12-.3.19-.57.31l-.9.44c-.26.13-.38.18-.6.25-.4.13-.84.16-1.3.05-.74-.16-1.26-.58-1.84-1.27a4.1 4.1 0 00-.6-.56 9.63 9.63 0 01-.87 0 4.1 4.1 0 00-.59.56c-.58.7-1.1 1.1-1.84 1.27-.46.1-.9.08-1.3-.05a3.48 3.48 0 01-.6-.25l-.9-.44a7.15 7.15 0 01-.19-.09c-1.31-.68-1.7-1.85-1.35-3.46.04-.22.07-.49.07-.76-.2-.23-.38-.46-.56-.7-.27-.06-.54-.1-.77-.1-.9-.02-1.55-.16-2.15-.63a2.52 2.52 0 01-.78-1.05 3.48 3.48 0 01-.18-.62l-.23-.98c-.07-.3-.1-.43-.1-.68a2.5 2.5 0 01.29-1.34c.34-.63.84-1.02 1.6-1.4.2-.11.45-.27.67-.45.05-.29.12-.58.2-.86a4.11 4.11 0 00-.42-.7c-.88-1.17-1.15-2.24-.46-3.4.11-.17.18-.27.35-.48l.63-.77c.1-.14.16-.2.24-.28.97-1.05 2.15-1.08 3.57-.43.2.1.45.18.71.25.27-.15.54-.28.82-.4.12-.25.21-.51.27-.74.22-.87.5-1.47 1.1-1.95.36-.29.76-.45 1.2-.52.17-.03.3-.04.48-.04h1.16c.3 0 .42 0 .65.04zM14.59 4H13.5c-.5 0-.75 0-1 1a6.35 6.35 0 01-.84 1.87c-.64.21-1.24.5-1.8.87a6.35 6.35 0 01-1.95-.52c-.93-.44-1.09-.24-1.4.14l-.63.78c-.32.4-.48.58.14 1.4.35.47.73 1.16.94 1.86-.22.6-.37 1.24-.43 1.9-.5.53-1.13.98-1.64 1.24-.92.47-.86.72-.75 1.2l.22.98c.12.48.17.73 1.2.75.57 0 1.33.13 2 .39.35.57.77 1.1 1.25 1.56.1.72.05 1.47-.07 2.03-.21 1 .01 1.12.46 1.34l.9.43c.45.22.68.33 1.34-.46.37-.44.95-.95 1.59-1.32a7.57 7.57 0 001.94 0c.64.37 1.22.88 1.6 1.32.65.8.88.68 1.33.46l.9-.43c.45-.22.67-.33.46-1.34a6.35 6.35 0 01-.07-2.03c.48-.46.9-.99 1.24-1.56a6.35 6.35 0 012-.4c1.04-.01 1.1-.26 1.2-.74l.23-.98c.11-.48.17-.73-.75-1.2a6.35 6.35 0 01-1.64-1.24c-.06-.66-.21-1.3-.43-1.9.21-.7.59-1.39.94-1.85.62-.83.46-1.02.14-1.4l-.63-.79c-.31-.38-.47-.58-1.4-.14-.51.24-1.24.45-1.95.52a7.47 7.47 0 00-1.8-.87c-.4-.6-.7-1.31-.84-1.87-.24-.94-.47-1-.91-1zM14 9.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
                fill="currentColor"
              />
            </g>
          </svg>
        </template>
        <span>Настройки</span>
      </tabbar-item>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Dictionary from '@/views/Dictionary';
import TabbarItem from '@/components/TabbarItem';

export default {
  name: 'home',
  components: {
    [TabbarItem.name]: TabbarItem,
    [Dictionary.name]: Dictionary,
    'view-achieve': async () => import('@/views/Achieve'),
    'view-settings': async () => import('@/views/Settings')
  },
  data() {
    return {
      view: 'dictionary',
      hasNotify: null
    };
  },
  computed: {
    ...mapState(['notify'])
  },
  created() {
    this.$_timer = 0;
  },
  watch: {
    view: {
      handler(name) {
        this.$bus.$emit(`view:${name}`);
      },
      immediate: true
    },
    notify() {
      requestAnimationFrame(() => {
        if (this._isMounted) {
          this.hasNotify = true;
          clearTimeout(this.$_timer);
          setTimeout(() => {
            requestAnimationFrame(() => {
              if (this._isMounted) {
                this.hasNotify = false;
              } else {
                this.$once('hook:mounted', this.notify);
              }
            });
          }, 3300);
        } else {
          this.$once('hook:mounted', this.notify);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.home {
  padding-bottom: 48px;
  padding-bottom: calc(48px + var(--safe-area-inset-bottom));
}

.notify,
.tabbar {
  position: fixed;
  left: 0;
  width: 100%;
  height: 48px;
  box-sizing: content-box;
  background-color: #202122;

  &::before {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #252627;
    transform-origin: center bottom;
    content: "";

    @media (min-resolution: 2dppx) {
      transform: scaleY(0.5);
    }

    @media (min-resolution: 3dppx) {
      transform: scaleY(0.33);
    }
  }
}

.notify {
  z-index: 2;
  bottom: 48px;
  bottom: calc(48px + var(--safe-area-inset-bottom));
  line-height: 48px;

  padding-left: 22px;
  @media (min-width: 530px) {
    padding-left: 44px;
  }

  transform: translateY(110%);
  transition: transform 0.3s ease-out;

  &--active {
    transform: translateY(0);
  }
}

.tabbar {
  z-index: 3;
  bottom: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: stretch;
  padding-bottom: 0;
  padding-bottom: var(--safe-area-inset-bottom);
}

html[theme="light"] {
  .notify,
  .tabbar {
    background-color: #fff;

    &::before {
      background-color: #fafafa;
    }
  }
}
</style>
