import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const shouldShowOnboard = async () => {
  return !store.state.settings.is_active && !store.state.settings.is_ready;
};

const routes = [{
  path: '/',
  name: 'home',
  component: async () => import('@/views/Home.vue'),
  beforeEnter: async (to, from, next) => {
    if (await shouldShowOnboard()) {
      next('/onboard');
    } else {
      next();
    }
  }
}, {
  path: '/onboard',
  name: 'onboard',
  component: async () => import('@/views/Onboard.vue'),
  beforeEnter: async (to, from, next) => {
    if (await shouldShowOnboard()) {
      next();
    } else {
      if (from.name === 'home') {
        next(false);
      } else {
        next('/');
      }
    }
  }
}];

const router = new Router({
  mode: 'hash',
  routes,
  async scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

export default router;
