import axios from '@/plugins/axios';

export default {
  // 登录
  async loginInSync(context, payload) {
    try {
      const res = await axios.post('/login/do_login.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_USER', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 验证码
  async getVerifyCodeSync(context, payload) {
    try {
      const res = await axios.post('/login/verify_code.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.verify_code);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 上传附件
  async uploadAttachmentSync(context, payload) {
    try {
      const res = await axios({
        url: '/sy/upload_input_file.html',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (res.data.status === 1) {
        return Promise.resolve(res.data.filePath);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 上传图片
  async uploadImgSync(context, payload) {
    try {
      const res = await axios({
        url: '/sy/upload_img.html',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (res.data.status === 1) {
        return Promise.resolve(res.data.picPath);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 批量上传图片
  async uploadImgMultipleSync(context, payload) {
    try {
      const res = await axios({
        url: '/sy/upload_multiple_image.html',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: payload,
      });
      if (res.data.status === 1) {
        return Promise.resolve(res.data.picPath);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  /**
   * 获取控制台数据(订单状态入口,商品销售统计,客户订单统计,营收趋势,营收简报)
   *
   * @param {*} context
   * @param {*} payload {
   *  operate: '1',
   *  gaStartDate: 商品销售统计开始日期,
   *  gaEndDate: 商品销售统计结束日期,
   *  baStartDate: 客户订单统计开始日期,
   *  baEndDate: 客户订单统计结束日期,
   *  raStartDate: 营收趋势开始日期,
   *  raEndDate: 营收趋势结束日期,
   *  bfaStartDate: 营收简报开始日期,
   *  bfaEndDate: 营收简报结束日期,
   * }
   * @returns {
   *  // 营收简报
   *  orderBriefAmout: {
   *    // 订单金额
   *    orderAllAmount: String,
   *    // 订单数量
   *    orderAllCount: String,
   *    // 收款金额
   *    orderAllAmount: String,
   *    // 收款数量
   *    orderAllCount: String,
   *  },
   *  // 营收趋势
   *  orderRevenueAmout: {
   *    // 订单金额/数量
   *    revenueOrderAmout: [],
   *    // 收款金额/数量
   *    revenueReceiptAmout: [],
   *  },
   *  // 客户订单统计
   *  orderBuyerAmout: [],
   *  // 商品销售统计
   *  orderGoodAmout: [],
   *  // 订单状态入口
   *  orderStatusCount: [
   *    {
   *      // 订单状态 1.待审核 4.待财务审核 5.待发货订单 8.完成发货 10.待支付订单(amontStatus + 10) 13.完成收款(amontStatus + 10)
   *      dStatus: String,
   *      orCount: String
   *    }
   *  ]
   * }
   */
  async getConsoleDataAsync(context, payload) {
    try {
      const res = await axios({
        url: 'index/indexweb.html',
        method: 'post',
        data: payload,
      });
      if (res.data.status === 1) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getChartDataSingleAsync(context, payload) {
    try {
      const res = await axios({
        url: payload.api,
        method: 'post',
        data: payload.params,
      });
      if (res.data.status === 1) {
        return Promise.resolve(res.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 验证权限
  async checkAuthorityAsync(context, payload) {
    try {
      const res = await axios.post('/r/userCheckRight.html', payload);
      if (res.data.status === 1 && res.data.hasRight === 1) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
