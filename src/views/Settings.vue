<template>
  <div class="view settings">
    <transition name="fade-height">
      <template v-if="!is_active">
        <div class="settings__block">
          <div class="caption-small">🤐 Ты отказался от рассылки</div>
          <tappable class="action confirm" @click="is_active = true">Возобновить рассылку</tappable>
        </div>
      </template>
    </transition>
    <transition name="fade-height">
      <template v-if="!notifications_are_enabled">
        <div class="settings__block">
          <div class="caption-small">🤙 Хочешь получать уведомления о прогрессе?</div>
          <tappable
            class="action confirm"
            @click="notifications_are_enabled = true"
          >Разрешенить уведомления</tappable>
        </div>
      </template>
    </transition>
    <div class="settings__block">
      <label class="caption-small" for="level_id">Мой уровень</label>
      <select class="select caption-big" name="level_id" id="level_id" v-model.number="level_id">
        <option value="2">Начинающий</option>
        <option value="3" selected>Изучающий</option>
        <option value="4">Знающий</option>
      </select>
    </div>
    <div class="settings__block">
      <div class="caption-small">👋 Начинём в</div>
      <picker :from="7" :to="12" v-model="start_at" />
    </div>
    <div class="settings__block">
      <div class="caption-small">💤 Закончим в</div>
      <picker :from="19" :to="24" v-model="end_at" />
    </div>
    <div class="settings__block">
      <transition name="fade-height">
        <template v-if="is_active">
          <tappable class="action cancel" @click="is_active = false">Отказаться от рассылки</tappable>
        </template>
      </transition>
      <transition name="fade-height">
        <template v-if="notifications_are_enabled">
          <tappable
            class="action cancel"
            @click="notifications_are_enabled = false"
          >Отказаться от уведомлений</tappable>
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import * as config from '@/model/app';
import Picker from '@/components/Picker';

export default {
  name: 'ViewSettings',
  components: {
    [Picker.name]: Picker,
    'tappable': async () => import(/* webpackChunkName: "components" */ '@/components/Tappable')
  },
  created() {
    this.$_awaitNotify = false;
    this.$_awaitActive = false;
  },
  computed: {
    start_at: {
      get() {
        return this.$store.state.settings.start_at;
      },
      set(value) {
        if (value !== this.$store.state.settings.start_at) {
          this.$store.commit('SETTINGS_START_AT', value);
        }
      }
    },
    end_at: {
      get() {
        return this.$store.state.settings.end_at;
      },
      set(value) {
        if (value !== this.$store.state.settings.end_at) {
          this.$store.commit('SETTINGS_END_AT', value);
        }
      }
    },
    level_id: {
      get() {
        return this.$store.state.settings.level_id;
      },
      set(value) {
        if (value !== this.$store.state.settings.level_id) {
          this.$store.commit('SETTINGS_LEVEL_ID', value);
        }
      }
    },
    is_active: {
      get() {
        return this.$store.state.settings.is_active;
      },
      set(value) {
        if (this.$_awaitActive) {
          return;
        }
        this.$_awaitActive = true;

        if (value) {
          this.$api.allowCommunityMessages(config.GROUP_ID, config.GROUP_ALLOW_MESSAGES).then(async () => {
            await this.$store.commit('SETTINGS_IS_ACTIVE', true);
            this.$_awaitActive = false;
          }).catch(async () => {
            await this.$store.commit('SETTINGS_IS_ACTIVE', false);
            this.$_awaitActive = false;
          });
        } else {
          this.$store.commit('SETTINGS_IS_ACTIVE', false);
          this.$nextTick(() => {
            this.$_awaitActive = false;
          });
        }
      }
    },
    notifications_are_enabled: {
      get() {
        return this.$store.state.settings.notifications_are_enabled;
      },
      set(value) {
        if (this.$_awaitNotify) {
          return;
        }
        this.$_awaitNotify = true;

        if (value) {
          this.$api.allowNotifications().then(async () => {
            await this.$store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', true);
            this.$_awaitNotify = false;
          }).catch(async () => {
            await this.$store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', false);
            this.$_awaitNotify = false;
          });
        } else {
          this.$api.denyNotifications().then(async () => {
            await this.$store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', false);
            this.$_awaitNotify = false;
          }).catch(async () => {
            await this.$store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', true);
            this.$_awaitNotify = false;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.settings {
  padding-top: 22px;

  &__block {
    margin-bottom: 48px;
  }

  .action {
    padding: 4px 16px;
    margin-left: -16px;
    margin-bottom: 16px;
  }

  .confirm {
    color: #71aaeb;
  }

  .cancel {
    color: #ff4e5f;
  }
}

.select {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDFsMyAzIDMtMyIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 18px auto;
}

html[theme="light"] {
  .select {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgOCA1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDFsMyAzIDMtMyIgc3Ryb2tlPSIjMjEyMTIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=");
  }
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease, margin-bottom 0.3s ease;
}

.fade-height-leave,
.fade-height-enter-to {
  opacity: 1;
  max-height: 112px;
  margin-bottom: 48px;
}

.fade-height-enter,
.fade-height-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}
</style>
