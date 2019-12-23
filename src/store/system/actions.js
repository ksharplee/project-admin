import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 添加编辑员工，设置员工启停用，修改密码
  async addOrEditEmployeeAsync(context, payload) {
    let rightId;
    if (payload.stop) {
      rightId = 246;
    } else if (payload.edit) {
      rightId = 244;
    } else {
      rightId = 243;
    }
    const right = await context.dispatch('checkAuthorityAsync', { rightId }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/a/do_admin.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getEmployeeListAsync', { timeLimit: null });
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
  // 员工列表
  async getEmployeeListAsync(context, payload) {
    try {
      const res = await axios.post('/a/fetchs.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.employeeList.data.timeLimit,
        p: context.state.employeeList.data.p,
      }, payload));
      if (res.data.status === 1) {
        if (payload && payload.all === '1') {
          return Promise.resolve(res.data.data.items);
        }
        context.commit('SET_EMPLOYEE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getEmployeeSingleAsync(context, payload) {
    try {
      const res = await axios.post('/a/detail.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 订单处理流程列表
  async orderSequenceListAsync(context, payload) {
    try {
      const res = await axios.post('/system/order_flow_setting_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_ORDER_SEQUENCE', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 订单处理流程设置
  async addOrEditOrderSequenceAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: payload.edit ? 72 : 71 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/system/add_save_order_flow_setting.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('orderSequenceListAsync');
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
  // 禁用订单处理流程
  async disableOrderSequenceAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 73 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/system/del_order_flow_setting.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('orderSequenceListAsync');
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
  // 基本信息
  async getBasicInfoAsync(context, payload) {
    try {
      const res = await axios.post('/system/sys_info_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_BASIC_INFO', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addOrEditBasicInfoAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 74 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/system/add_save_sys_info.html', payload);
        if (res.data.status === 1) {
          context.dispatch('getBasicInfoAsync');
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
  async getAreaInfoAsync(context, payload) {
    if (sessionStorage.getItem('areaInfo')) {
      context.commit('SET_AREA_INFO', JSON.parse(sessionStorage.getItem('areaInfo')));
      return Promise.resolve(1);
    }
    try {
      const res = await axios.post('/system/getFirstArea.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_AREA_INFO', res.data);
        sessionStorage.setItem('areaInfo', JSON.stringify(res.data));
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getAreaRegionInfoAsync(context, payload) {
    try {
      const res = await axios.post('/system/getNextArea.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 生成二维码
  async getQrcodeAsync(context, payload) {
    try {
      const res = await axios.post('/sy/get_erweima.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.picPath);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 获取广告图
  async getAdsAsync(context, payload) {
    try {
      const res = await axios.post('/ads/banners_ads_lists.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 上传广告图
  async setAdsAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 501 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/ads/do_banners_ads.html', payload);
        if (res.data.status === 1) {
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
  // 获取其他广告图
  async getOtherAdsAsync(context, payload) {
    try {
      const res = await axios.post('/ads/other_ads_lists.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 上传其他广告图
  async setOtherAdsAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 503 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/ads/do_other_ads.html', payload);
        if (res.data.status === 1) {
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
