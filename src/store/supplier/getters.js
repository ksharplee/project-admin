import * as R from 'ramda';

export default {
  supplierFilter: state => (name) => {
    if (name) {
      return R.filter(item => item.dnames.toLowerCase().match(name.toLowerCase()), state.supplierList.data.items);
    }
    return state.supplierList.data.items;
  },
};
