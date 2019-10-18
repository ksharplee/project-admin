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
      next();
    } else {
      next({ name: 'login' });
    }
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
