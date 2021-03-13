import {
  SET_PRODUCT_CATEGORY,
  SET_PRODUCT_BRAND,
  SET_PRODUCT_UNITS,
  SET_PRODUCT_LIST,
  SET_ONLINE_CATE,
  SET_PRODUCT_HOT_SEARCH,
} from '../mutation-types';

export default {
  [SET_PRODUCT_LIST](state, payload) {
    state.productList.data = payload;
    state.productList.status = 1;
  },
  [SET_PRODUCT_CATEGORY](state, payload) {
    state.productCategory.data.items = payload;
    state.productCategory.status = 1;
  },
  [SET_PRODUCT_HOT_SEARCH](state, payload) {
    state.productHotSearch.data = payload;
    state.productHotSearch.status = 1;
  },
  [SET_PRODUCT_BRAND](state, payload) {
    state.productBrand.data = payload;
    state.productBrand.status = 1;
  },
  [SET_PRODUCT_UNITS](state, payload) {
    state.productUnits.data = payload;
    state.productUnits.status = 1;
  },
  [SET_ONLINE_CATE](state, payload) {
    state.onlineCate.data = payload;
    state.onlineCate.status = 1;
  },
};
