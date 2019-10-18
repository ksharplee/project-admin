import {
  SET_INVOICE_LIST,
  SET_PAYMENT_LIST,
  SET_BANK_LIST,
  SET_PAYMENT_ORDER_LIST,
} from '../mutation-types';

export default {
  [SET_INVOICE_LIST](state, payload) {
    state.invoiceList = payload;
  },
  [SET_PAYMENT_LIST](state, payload) {
    state.paymentList = payload;
  },
  [SET_PAYMENT_ORDER_LIST](state, payload) {
    state.paymentOrderList = payload;
  },
  [SET_BANK_LIST](state, payload) {
    state.bankList = payload;
  },
};
