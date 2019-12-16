import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 添加客户
  async addOrEditCustomerAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: payload.edit ? 263 : 259 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  // 删除客户
  async deleteCustomerAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 262 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
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
    const right = await context.dispatch('checkAuthorityAsync', { rightId: payload.edit ? 351 : 350 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/buyer/do_addr.html', payload);
        if (res.data.status === 1) {
          return Promise.resolve(res.data.data);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  // 传id
  async deleteCustomerShippingAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 352 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/buyer/del_addr.html', payload);
        if (res.data.status === 1) {
          return Promise.resolve(res.data.data);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  // 传id
  async setDefaultCustomerShippingAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 353 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/buyer/set_default.html', payload);
        if (res.data.status === 1) {
          return Promise.resolve(res.data.data);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
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
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 261 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  async setCustomerGrade(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 260 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
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
    const right = await context.dispatch('checkAuthorityAsync', { rightId: payload.edit ? 254 : 253 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  async deleteCustomerGradeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 255 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
};
