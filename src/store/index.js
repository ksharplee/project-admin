import Vue from 'vue';
import Vuex from 'vuex';
import state from './root/state';
import getters from './root/getters';
import mutations from './root/mutations';
import actions from './root/actions';
import product from './product/index';
import system from './system/index';
import customer from './customer/index';
import finance from './finance/index';
import order from './order/index';
import authority from './authority/index';
import warehouse from './warehouse/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    product: {
      namespaced: true,
      state: product.state,
      getters: product.getters,
      mutations: product.mutations,
      actions: product.actions,
    },
    order: {
      namespaced: true,
      state: order.state,
      getters: order.getters,
      mutations: order.mutations,
      actions: order.actions,
    },
    system: {
      namespaced: true,
      state: system.state,
      getters: system.getters,
      mutations: system.mutations,
      actions: system.actions,
    },
    customer: {
      namespaced: true,
      state: customer.state,
      getters: customer.getters,
      mutations: customer.mutations,
      actions: customer.actions,
    },
    finance: {
      namespaced: true,
      state: finance.state,
      getters: finance.getters,
      mutations: finance.mutations,
      actions: finance.actions,
    },
    authority: {
      namespaced: true,
      state: authority.state,
      getters: authority.getters,
      mutations: authority.mutations,
      actions: authority.actions,
    },
    warehouse: {
      namespaced: true,
      state: warehouse.state,
      getters: warehouse.getters,
      mutations: warehouse.mutations,
      actions: warehouse.actions,
    },
  },
  state,
  getters,
  mutations,
  actions,
});
