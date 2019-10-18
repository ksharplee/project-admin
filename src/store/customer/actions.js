import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 添加客户
  async addOrEditCustomerAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/add_save_buyer.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getCustomerListAsync', { timeLimit: null });
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除客户
  async deleteCustomerAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/del_buyer.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getCustomerListAsync', { timeLimit: null });
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 客户收货地址列表,传buyerId
  async getCustomerShippingListAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/area_lists.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 传buyerId,buyerUid
  async addOrEditCustomerShippingAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/do_addr.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 传id
  async deleteCustomerShippingAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/del_addr.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 传id
  async setDefaultCustomerShippingAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/set_default.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 客户列表
  async getCustomerListAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/buyer_list.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.customerList.data.timeLimit,
        p: context.state.customerList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_CUSTOMER_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCustomerListForSearchAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/buyer_list.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.customerListForSearch.data.timeLimit,
        p: context.state.customerListForSearch.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_CUSTOMER_FOR_SEARCH_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCustomerListForSelectAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/buyer_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_CUSTOMER_FOR_SELECT_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async setCustomerGrade(context, payload) {
    try {
      const res = await axios.post('/buyer/do_buyer_level.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getCustomerListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 客户等级列表
  async getCustomerGradeListAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/level_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_CUSTOMER_GRADE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addOrEditCustomerGradeAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/add_save_level.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getCustomerGradeListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteCustomerGradeAsync(context, payload) {
    try {
      const res = await axios.post('/buyer/del_level.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getCustomerGradeListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
