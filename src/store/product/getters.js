import * as R from 'ramda';

export default {
  productBrandInUse(state) {
    return R.filter(R.propEq('isUse', '1'), state.productBrand.data.items);
  },
  brandFilter: state => (name) => {
    if (name) {
      return R.filter(item => item.dnames.toLowerCase().match(name.toLowerCase()), state.productBrand.data.items);
    }
    return state.productBrand.data.items;
  },
  productCategoryGetter(state) {
    return R.prepend({ dnames: '全部分类', id: '0' }, state.productCategory.data.items);
  },
};
