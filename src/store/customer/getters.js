import * as R from 'ramda';

export default {
  customerFilter: state => (name) => {
    if (name) {
      return R.filter(item => item.dnames.toLowerCase().match(name.toLowerCase()), state.customerListForSelect.data);
    }
    return state.customerListForSelect.data;
  },
};
