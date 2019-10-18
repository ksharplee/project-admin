import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 添加供应商
  async addSupplierAsync(context, payload) {
    try {
      const res = await axios.post('/supplierOffline/add_save_supplier_offline.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getSupplierListAsync', { timeLimit: null });
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除供应商
  async deleteSupplierAsync(context, payload) {
    try {
      const res = await axios.post('/supplierOffline/del_supplier_offline.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getSupplierListAsync', { timeLimit: null });
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 供应商列表
  async getSupplierListAsync(context, payload) {
    try {
      const res = await axios.post('/supplierOffline/supplier_offline_list.html', R.mergeRight({
        // pageSize: process.env.VUE_APP_PAGESIZE,
        // timeLimit: context.state.supplierList.data.timeLimit,
        pageSize: '-1', time_list: null,
        // p: context.state.supplierList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_SUPPLIER_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
