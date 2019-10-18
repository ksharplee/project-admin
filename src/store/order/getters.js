import * as R from 'ramda';

export default {
  selectedProductsFilter: state => (arr) => {
    if (arr.length) {
      return R.difference(state.productListForSelect.data.items, arr);
    }
    return state.productListForSelect.data.items;
  },

};
