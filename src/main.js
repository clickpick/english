import Vue from 'vue';
import axios from 'axios';
import retry from 'axios-retry';
import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import { readyDOM, readyRender, prevent } from '@/api/dom';
import { getUTCOffset } from '@/api/date';
import { parseQuery } from '@/api/uri';
import { isWindows } from '@/api/platform';
import * as speech from '@/api/speech';

const init = async () => {
  const bus = new Vue();

  const api = new VKMiniAppAPI();
  api.ready = false;

  const axiosInstance = axios.create({
    baseURL: 'https://english.ezavalishin.ru/vk-user',
    headers: {
      'Vk-Params': window.btoa(JSON.stringify({
        ...parseQuery(window.location.search),
        'utc_offset': getUTCOffset(),
      })),
      'Accept': 'application/json'
    }
  });
  retry(axiosInstance, { retries: 3, shouldResetTimeout: true });

  Object.defineProperties(Vue.prototype, {
    $bus: {
      value: bus
    },
    $api: {
      value: api
    },
    $axios: {
      value: axiosInstance
    },
    $speech: {
      value: speech
    },
    $isIOS: {
      value: (/ipad|iphone|ipod/i).test(navigator.userAgent)
    }
  });

  const auth = async () => axiosInstance.post('/auth').then(async (response) => {
    await store.commit('AUTH', response.data.data);
  });
  const pendingAuth = auth();

  const setBars = async (style, color) => {
    if (api.ready) {
      api.setViewSettings(style, color, color);
    } else {
      bus.$once('api:ready', async () => (
        api.setViewSettings(style, color, color)
      ));
    }
  };
  const setTheme = (theme) => {
    if (api.connect.supports('VKWebAppSetViewSettings')) {
      if (theme === 'light') {
        setBars('dark', '#fff');
      } else {
        setBars('light', '#202122');
      }
    }
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('theme', theme);
    });
  };

  api.connect.subscribe(({ detail }) => {
    // ignore manual
    if (detail.request_id || detail.data && detail.data.request_id) {
      return;
    }

    // handle auto
    switch (detail.type) {
      case 'VKWebAppViewRestore':
        auth();
        break;
      case 'VKWebAppUpdateConfig':
        if (api.connect.isWebView()) {
          setTheme((detail.data.scheme === 'client_light' || detail.data.scheme === 'bright_light') ? 'light' : 'default');
        }
        break;
      case 'VKWebAppAllowNotificationsResult':
        store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', detail.data.result);
        break;
      case 'VKWebAppDenyNotificationsResult':
        store.commit('SETTINGS_NOTIFICATIONS_ARE_ENABLED', !detail.data.result);
        break;
    }
  });

  readyDOM(() => {
    ['dragstart', 'dragenter', 'gesturestart', 'gesturechange', 'MSGestureStart'].forEach((name) => {
      document.addEventListener(name, prevent, { passive: false });
    });

    if (!api.connect.isWebView()) {
      requestAnimationFrame(() => {
        document.body.classList.add('should-animate-ready');
        if (isWindows()) {
          document.body.classList.add('custom-scroll');
        }
      });
    }
  });

  readyRender(() => {
    pendingAuth.then(() => {
      requestAnimationFrame(() => {
        const app = new Vue({
          router,
          store,
          render: h => h(App)
        });

        app.$once('hook:mounted', () => {
          api.initApp();
          api.ready = true;
          bus.$emit('api:ready');
          if (!api.connect.isWebView()) {
            requestAnimationFrame(() => {
              document.body.classList.add('animate-ready');
              setTimeout(() => {
                requestAnimationFrame(() => {
                  document.body.classList.add('animate-reset');
                });
              }, 300);
            });
          }
        });

        app.$mount('#app');
      });
    });
  });
};

window.onerror = (e) => {
  // TODO
  // eslint-disable-next-line
  console.log('crash by error', e);
};

window.onunhandledrejection = (e) => {
  // TODO
  // eslint-disable-next-line
  console.log('crash by promise', e);
};

init().catch((e) => {
  // TODO
  // eslint-disable-next-line
  console.log('crash by app', e);
});

