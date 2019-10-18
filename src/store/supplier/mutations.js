import {
  SET_SUPPLIER_LIST,
} from '../mutation-types';

export default {
  [SET_SUPPLIER_LIST](state, payload) {
    state.supplierList = payload;
  },
};
