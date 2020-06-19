import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 选择商品
  async getProductListForSelectAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 320 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/g/get_goods_list.html', R.mergeRight({
          pageSize: process.env.VUE_APP_PAGESIZE,
          priceStatus: context.rootState.user.priceStatus,
          timeLimit: context.state.productListForSelect.data.timeLimit,
          p: context.state.productListForSelect.data.p,
        }, payload));
        if (res.data.status === 1) {
          context.commit('SET_PRODUCT_LIST_FOR_SELECT', res.data.data);
          return Promise.resolve(res.data);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  // 获取订单列表
  async getOrderListAsync(context, payload) {
    try {
      const res = await axios.post('/o/lists.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.orderList.data.timeLimit,
        p: context.state.orderList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_ORDER_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getOrderListForPaymentAsync(context, payload) {
    try {
      const res = await axios.post('/o/lists.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 获取商品单位
  async getProductUnitsAsync(context, payload) {
    try {
      const res = await axios.post('/g/good_goods_unit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加订单
  async addOrderAsync(context, payload) {
    try {
      const res = await axios.post('/o/add.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getOrderListAsync', { sortType: '2', operate: '1' });
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 取消订单
  async cancelOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1038 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/o/orderSuCancel.html', { id: payload.id, sectionId: payload.sectionId });
        if (res.data.status === 1) {
          if (!payload.single) { await context.dispatch('getOrderListAsync', R.omit(['id', 'sectionId'], payload)); }
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
  // 确认订单
  async confirmOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1039 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/o/orderConfirm.html', { id: payload.id, sectionId: payload.sectionId });
        if (res.data.status === 1) {
          if (!payload.single) { await context.dispatch('getOrderListAsync', R.omit(['id', 'sectionId'], payload)); }
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
  // 财务审核订单
  async finacialCheckOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1040 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/o/orderFinanceCheck.html', { id: payload.id, sectionId: payload.sectionId });
        if (res.data.status === 1) {
          if (!payload.single) { await context.dispatch('getOrderListAsync', R.omit(['id', 'sectionId'], payload)); }
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
  // 作废订单
  async nullifyOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1041 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/o/orderInvalid.html', { id: payload.id, sectionId: payload.sectionId });
        if (res.data.status === 1) {
          if (!payload.single) { await context.dispatch('getOrderListAsync', R.omit(['id', 'sectionId'], payload)); }
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
  // 完成订单
  async completeOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1043 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/o/orderSuComplete.html', { id: payload.id, sectionId: payload.sectionId });
        if (res.data.status === 1) {
          if (!payload.single) { await context.dispatch('getOrderListAsync', R.omit(['id', 'sectionId'], payload)); }
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
  // 订单详情
  async getOrderDetailAsync(context, payload) {
    try {
      const res = await axios.post('/o/orderDetail.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 订单编辑
  async editOrderAsync(context, payload) {
    try {
      const res = await axios.post('/o/edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 发货单列表
  async getShippingOrderListAsync(context, payload) {
    try {
      const res = await axios.post('/sd/sendOrderList.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 发货单详情
  // async getShippingOrderDetailAsync(context, payload) {
  //   try {
  //     const res = await axios.post('/sd/sendDesc.html', payload);
  //     if (res.data.status === 1) {
  //       return Promise.resolve(res.data.data);
  //     }
  //     return Promise.reject(new Error(res.data.info));
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // },
  // 添加发货单
  async addShippingOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1201 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/sd/add.html', payload);
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
  // 编辑发货单
  async editShippingOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1202 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/sd/edit.html', payload);
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
  // 审核发货单
  async confirmShippingOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1204 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/sd/sendCheck.html', payload);
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
  // 删除发货单
  async deleteShippingOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1203 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/sd/delete.html', payload);
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
  // 作废发货单
  async nullifyShippingOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1205 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/sd/sendInvalid.html', payload);
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
  // 收款单列表
  async getPaymentOrderListAsync(context, payload) {
    try {
      const res = await axios.post('/re/receiptOrderList.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addPaymentOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1101 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/re/add.html', payload);
        if (res.data.status === 1) {
          return Promise.resolve(res.data.id);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  // async editPaymentOrderAsync(context, payload) {
  //   try {
  //     const res = await axios.post('/re/edit.html', payload);
  //     if (res.data.status === 1) {
  //       return Promise.resolve(res.data.status);
  //     }
  //     return Promise.reject(new Error(res.data.info));
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // },
  // async deletePaymentOrderAsync(context, payload) {
  //   const right = await context.dispatch('checkAuthorityAsync', { rightId: 6501 }, { root: true });
  //   if (right) {
  //   try {
  //     const res = await axios.post('/re/delete.html', payload);
  //     if (res.data.status === 1) {
  //       return Promise.resolve(res.data.status);
  //     }
  //     return Promise.reject(new Error(res.data.info));
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  //     } else {
  //     return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
  //   }
  // },
  async confirmPaymentOrderAsync(context, payload) {
    if (payload.checkRight) {
      const right = await context.dispatch('checkAuthorityAsync', { rightId: 1104 }, { root: true });
      if (right) {
        try {
          const res = await axios.post('/re/receiptCheck.html', payload);
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
    } else {
      try {
        const res = await axios.post('/re/receiptCheck.html', payload);
        if (res.data.status === 1) {
          return Promise.resolve(res.data.status);
        }
        return Promise.reject(new Error(res.data.info));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
  async nullifyPaymentOrderAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 1105 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/re/receiptInvalid.html', payload);
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
