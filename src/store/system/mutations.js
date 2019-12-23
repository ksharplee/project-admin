import * as R from 'ramda';
import {
  SET_EMPLOYEE_LIST,
  SET_BASIC_INFO,
  SET_AREA_INFO,
  SET_ORDER_SEQUENCE,
  CLEAR_BASIC_INFO,
} from '../mutation-types';

export default {
  [CLEAR_BASIC_INFO](state) {
    state.basicInfo.status = 0;
  },
  [SET_EMPLOYEE_LIST](state, payload) {
    state.employeeList = payload;
  },
  [SET_BASIC_INFO](state, payload) {
    state.basicInfo = payload;
  },
  [SET_AREA_INFO](state, payload) {
    state.areaInfo = payload;
  },
  [SET_ORDER_SEQUENCE](state, payload) {
    if (payload.data.length) {
      state.orderSequence.data = R.prepend(state.orderSequence.data[0], payload.data);
    }
    state.orderSequence.status = payload.status;
  },
};
