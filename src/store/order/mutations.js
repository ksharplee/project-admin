import {
  SET_SUPPLIER_LIST,
  SET_PRODUCT_LIST_FOR_SELECT,
  SET_ORDER_LIST,
} from '../mutation-types';

export default {
  [SET_SUPPLIER_LIST](state, payload) {
    state.supplierList = payload;
  },
  [SET_PRODUCT_LIST_FOR_SELECT](state, payload) {
    state.productListForSelect.data = payload;
    state.productListForSelect.status = 1;
  },
  [SET_ORDER_LIST](state, payload) {
    state.orderList = payload;
  },
};
