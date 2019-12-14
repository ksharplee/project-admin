import * as R from 'ramda';
import {
  SET_DEPARTMENT_LIST,
  SET_AUTHORITY_LIST,
  SET_AUTHORITY_ROLE_LIST,
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
    const { length } = R.keys(payload);
    let arrAll = [];
    const resource = R.clone(payload);
    for (let i = 1; i <= length; i += 1) {
      arrAll = R.concat(resource[`${i}`], arrAll);
    }
    state.departmentAll = arrAll;
    const arr = departmentFlatten(objToArray(payload, length));
    state.departmentList = arr;
  },
  [SET_AUTHORITY_LIST](state, payload) {
    state.authorityList = payload;
  },
  [SET_AUTHORITY_ROLE_LIST](state, payload) {
    state.roleList = payload;
  },
};
