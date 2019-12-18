import {
  SET_USER,
  CLEAR_USER,
  TOGGLE_SNACKBAR,
  SET_BREADCRUMBS,
  START_LOADING,
  END_LOADING,
  SET_GLOBAL_CUSTOMER,
  CLOSE_SNACKBAR,
} from '../mutation-types';

export default {
  [SET_GLOBAL_CUSTOMER](state, payload) {
    state.customerId = payload;
  },
  [START_LOADING](state) {
    state.loading = true;
  },
  [END_LOADING](state) {
    state.loading = false;
  },
  [SET_BREADCRUMBS](state, payload) {
    state.breadCrumbs = payload;
  },
  [SET_USER](state, payload) {
    sessionStorage.setItem('user', JSON.stringify(payload));
    state.user = payload;
  },
  [CLEAR_USER](state) {
    sessionStorage.clear('user');
    state.user = null;
  },
  [TOGGLE_SNACKBAR](state, payload) {
    if (payload.type === 'error') {
      state.snackbarColor = 'error';
      state.snackbarIcon = 'mdi-alert-circle';
    } else {
      state.snackbarColor = 'success';
      state.snackbarIcon = 'mdi-check';
    }
    state.snackbarText = payload.text;
    state.snackbarShow = true;
  },
  [CLOSE_SNACKBAR](state) {
    state.snackbarShow = false;
  },
};
