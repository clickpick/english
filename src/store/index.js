import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    notify: null,
    settings: {
      start_at: 10,
      end_at: 20,
      level_id: 3,
      is_active: false,
      is_ready: false,
      notifications_are_enabled: false
    }
  },
  mutations: {
    async AUTH(state, payload) {
      if (!payload.start_at && payload.start_at !== 0) {
        payload.start_at = state.settings.start_at;
      }

      if (!payload.end_at && payload.end_at !== 0) {
        payload.end_at = state.settings.end_at;
      }

      if (!payload.level_id && payload.level_id !== 0) {
        payload.level_id = state.settings.level_id;
      }

      if (!payload.is_active && payload.is_active !== false) {
        payload.is_active = state.settings.is_active;
      }

      if (!payload.is_ready && payload.is_ready !== false) {
        payload.is_ready = state.settings.is_ready;
      }

      if (!payload.notifications_are_enabled && payload.notifications_are_enabled !== false) {
        payload.notifications_are_enabled = state.settings.notifications_are_enabled;
      }

      state.settings = {
        start_at: payload.start_at / 60,
        end_at: payload.end_at / 60,
        level_id: payload.level_id,
        is_active: payload.is_active,
        is_ready: payload.is_ready,
        notifications_are_enabled: payload.notifications_are_enabled
      };
    },
    async SETTINGS_START_AT(state, payload) {
      state.settings.start_at = payload;
    },
    async SETTINGS_END_AT(state, payload) {
      state.settings.end_at = payload;
    },
    async SETTINGS_LEVEL_ID(state, payload) {
      state.settings.level_id = payload;
    },
    async SETTINGS_IS_ACTIVE(state, payload) {
      state.settings.is_active = payload;
    },
    async SETTINGS_IS_READY(state, payload) {
      state.settings.is_ready = payload;
    },
    async SETTINGS_NOTIFICATIONS_ARE_ENABLED(state, payload) {
      state.settings.notifications_are_enabled = payload;
    },
    async HOME_NOTIFY(state, payload) {
      state.notify = payload;
    }
  },
  actions: {
    async start(store) {
      await store.commit('SETTINGS_IS_ACTIVE', true);
    },
    async notify(store, message) {
      await store.commit('HOME_NOTIFY', message);
    }
  }
});

store.subscribe(async (mutation, state) => {
  if (mutation.type.startsWith('SETTINGS')) {
    await store._vm.$axios.post('/me/settings', {
      ...state.settings,
      start_at: state.settings.start_at * 60,
      end_at: state.settings.end_at * 60
    });
  }
});

export default store;
