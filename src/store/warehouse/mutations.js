import {
  SET_WAREHOUSE_LIST,
  SET_WAREHOUSE_INSTOCK_LIST,
  SET_WAREHOUSE_INSTOCK_TYPE_LIST,
  SET_WAREHOUSE_OUTSTOCK_TYPE_LIST,
  SET_WAREHOUSE_OUTSTOCK_LIST,
  SET_WAREHOUSE_PRODUCT_STOCK,
} from '../mutation-types';

export default {
  [SET_WAREHOUSE_LIST](state, payload) {
    state.warehouseList = payload;
  },
  [SET_WAREHOUSE_INSTOCK_LIST](state, payload) {
    state.warehouseInstockList = payload;
  },
  [SET_WAREHOUSE_OUTSTOCK_LIST](state, payload) {
    state.warehouseOutstockList = payload;
  },
  [SET_WAREHOUSE_PRODUCT_STOCK](state, payload) {
    state.warehouseProductStock = payload;
  },
  [SET_WAREHOUSE_INSTOCK_TYPE_LIST](state, payload) {
    state.warehouseInstockTypeList = payload;
  },
  [SET_WAREHOUSE_OUTSTOCK_TYPE_LIST](state, payload) {
    state.warehouseOutstockTypeList = payload;
  },
};
