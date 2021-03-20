import { SET_INFO_CATEGORIES, SET_INFO_LIST, SET_NEWS_LIST } from '../mutation-types';

export default {
  [SET_INFO_CATEGORIES](state, payload) {
    state.infoCategories = payload;
  },
  [SET_INFO_LIST](state, payload) {
    state.infoList = payload;
  },
  [SET_NEWS_LIST](state, payload) {
    state.newsList = payload;
  },
};
