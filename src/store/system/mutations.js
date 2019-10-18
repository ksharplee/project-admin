import {
  SET_EMPLOYEE_LIST,
  SET_BASIC_INFO,
  SET_AREA_INFO,
  SET_ORDER_SEQUENCE,
} from '../mutation-types';

export default {
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
    state.orderSequence = payload;
  },
};
