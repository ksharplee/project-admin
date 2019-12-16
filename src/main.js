import Vue from 'vue';
import * as R from 'ramda';
import App from './App.vue';
import router from './router';
import store from './store/index';
import vuetify from './plugins/vuetify';
import plugins from './plugins/plugins';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.use(plugins);

router.beforeEach((to, from, next) => {
  if (!store.state.user && to.name !== 'login') {
    if (
      sessionStorage.getItem('user')
    ) {
      store.commit('SET_USER', JSON.parse(sessionStorage.getItem('user')));
      if (to.meta.required) {
        store.dispatch('checkAuthorityAsync', { rightId: to.meta.id }).then((res) => {
          if (res) {
            next();
          } else {
            store.commit('TOGGLE_SNACKBAR', {
              type: 'error',
              text: '您不具备目标页面权限，请联系管理员',
            });
          }
        });
      } else {
        next();
      }
    } else {
      next({ name: 'login' });
    }
  } else if (to.meta.required) {
    store.dispatch('checkAuthorityAsync', { rightId: to.meta.id }).then((res) => {
      if (res) {
        next();
      } else {
        store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '您不具备目标页面权限，请联系管理员',
        });
      }
    });
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
