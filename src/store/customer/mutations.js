import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER_GRADE_LIST,
  SET_CUSTOMER_FOR_SEARCH_LIST,
  SET_CUSTOMER_FOR_SELECT_LIST,
  SET_CUSTOMER_NEWS_LETTER_LIST,
  SET_CUSTOMER_FEEDBACK_LIST,
} from '../mutation-types';

export default {
  [SET_CUSTOMER_LIST](state, payload) {
    state.customerList = payload;
  },
  [SET_CUSTOMER_FOR_SEARCH_LIST](state, payload) {
    state.customerListForSearch = payload;
  },
  [SET_CUSTOMER_FOR_SELECT_LIST](state, payload) {
    state.customerListForSelect = payload;
  },
  [SET_CUSTOMER_GRADE_LIST](state, payload) {
    state.customerGradeList = payload;
  },
  [SET_CUSTOMER_FEEDBACK_LIST](state, payload) {
    state.customerFeedbackList = payload;
  },
  [SET_CUSTOMER_NEWS_LETTER_LIST](state, payload) {
    state.customerNewsLetterList = payload;
  },
};
