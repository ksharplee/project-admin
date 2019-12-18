import * as R from 'ramda';

export default {
  postDepartmentsFilter: state => arr => R.filter(
    item => R.includes(item.id, arr),
    state.departmentAll ? state.departmentAll : []
  ),
};
