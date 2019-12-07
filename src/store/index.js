import Vue from 'vue';
import Vuex from 'vuex';
import state from './root/state';
import getters from './root/getters';
import mutations from './root/mutations';
import actions from './root/actions';
import product from './product/index';
import supplier from './supplier/index';
import system from './system/index';
import customer from './customer/index';
import finance from './finance/index';
import order from './order/index';
import authority from './authority/index';

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
    supplier: {
      namespaced: true,
      state: supplier.state,
      getters: supplier.getters,
      mutations: supplier.mutations,
      actions: supplier.actions,
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
  },
  state,
  getters,
  mutations,
  actions,
});
