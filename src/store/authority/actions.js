// import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 部门列表
  async getDepartmentListAsync(context, payload) {
    try {
      const res = await axios.post('/r/sectionList.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_DEPARTMENT_LIST', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addDepartmentAsync(context, payload) {
    try {
      const res = await axios.post('/r/sectionadd.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getDepartmentListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editDepartmentAsync(context, payload) {
    try {
      const res = await axios.post('/r/sectionEdit.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getDepartmentListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
