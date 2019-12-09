import * as R from 'ramda';
import {
  SET_DEPARTMENT_LIST,
  SET_AUTHORITY_LIST,
} from '../mutation-types';

// 权限对象转为数组
const objToArray = (obj, length) => {
  let arr = [];
  for (let i = 1; i <= length; i += 1) {
    arr = R.append(R.path(`${i}`, obj), arr);
  }
  return arr;
};

const departmentFlatten = (arr) => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    R.map((item) => {
      item.children = R.filter(R.propEq('parentId', item.id), arr[i]);
      return item;
    }, arr[i - 1]);
  }
  return arr[0];
};

export default {
  [SET_DEPARTMENT_LIST](state, payload) {
    const arr = departmentFlatten(objToArray(payload, R.keys(payload).length));
    state.departmentList = arr;
  },
  [SET_AUTHORITY_LIST](state, payload) {
    state.authorityList = payload;
  },
};
