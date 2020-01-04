import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 仓库列表
  async getWarehouseListAsync(context, payload) {
    try {
      const res = await axios.post('/wh/warehouse_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加仓库
  async addWarehouseAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 360 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/add_warehouse.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseListAsync');
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
  // 编辑仓库
  async editWarehouseAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 361 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/save_warehouse.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseListAsync');
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
  // 删除仓库
  async deleteWarehouseAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 362 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/del_warehouse.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseListAsync', { timeLimit: null });
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
  // 入库类型列表
  async getWarehouseInstockTypeListAsync(context, payload) {
    try {
      const res = await axios.post('/wh/in_warehouse_type_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_INSTOCK_TYPE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加入库类型
  async addWarehouseInstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 365 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/add_in_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseInstockTypeListAsync');
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
  // 编辑入库类型
  async editWarehouseInstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 366 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/save_in_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseInstockTypeListAsync');
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
  // 删除入库类型
  async deleteWarehouseInstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 367 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/del_in_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseInstockTypeListAsync', { timeLimit: null });
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
  // 出库类型列表
  async getWarehouseOutstockTypeListAsync(context, payload) {
    try {
      const res = await axios.post('/wh/out_warehouse_type_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_OUTSTOCK_TYPE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加出库类型
  async addWarehouseOutstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 369 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/add_out_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseOutstockTypeListAsync');
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
  // 编辑出库类型
  async editWarehouseOutstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 370 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/save_out_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseOutstockTypeListAsync');
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
  // 删除出库类型
  async deleteWarehouseOutstockTypeAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 371 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/wh/del_out_warehouse_type.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getWarehouseOutstockTypeListAsync', { timeLimit: null });
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
  // 入库单列表
  async getWarehouseIntockListAsync(context, payload) {
    try {
      const res = await axios.post('/si/lists.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.warehouseInstockList.data.timeLimit,
        p: context.state.warehouseInstockList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_INSTOCK_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加入库单
  async addWarehouseInstockAsync(context, payload) {
    try {
      const res = await axios.post('/si/add.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 编辑入库单
  async editWarehouseInstockAsync(context, payload) {
    try {
      const res = await axios.post('/si/edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除入库单
  async deleteWarehouseInstockAsync(context, payload) {
    try {
      const res = await axios.post('/si/delete.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseIntockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 审核入库单
  async checkWarehouseInstockAsync(context, payload) {
    try {
      const res = await axios.post('/si/stockInCheck.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseIntockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 作废入库单
  async nullifyWarehouseInstockAsync(context, payload) {
    try {
      const res = await axios.post('/si/stockInInvalid.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseIntockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 入库单明细
  async getWarehouseInstockDetailAsync(context, payload) {
    try {
      const res = await axios.post('/si/stockInDesc.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 出库单列表
  async getWarehouseOutstockListAsync(context, payload) {
    try {
      const res = await axios.post('/sot/lists.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.warehouseInstockList.data.timeLimit,
        p: context.state.warehouseInstockList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_OUTSTOCK_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加出库单
  async addWarehouseOutstockAsync(context, payload) {
    try {
      const res = await axios.post('/sot/add.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 编辑出库单
  async editWarehouseOutstockAsync(context, payload) {
    try {
      const res = await axios.post('/sot/edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除出库单
  async deleteWarehouseOutstockAsync(context, payload) {
    try {
      const res = await axios.post('/sot/delete.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseOutstockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 审核出库单
  async checkWarehouseOutstockAsync(context, payload) {
    try {
      const res = await axios.post('/sot/stockInCheck.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseOutstockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 作废出库单
  async nullifyWarehouseOutstockAsync(context, payload) {
    try {
      const res = await axios.post('/sot/stockInInvalid.html', payload);
      if (res.data.status === 1) {
        if (payload.reload) {
          await context.dispatch('getWarehouseOutstockListAsync');
        }
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 出库单明细
  async getWarehouseOutstockDetailAsync(context, payload) {
    try {
      const res = await axios.post('/sot/stockInDesc.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品库存
  async getWarehouseProductStockAsync(context, payload) {
    try {
      const res = await axios.post('/rs/stock_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_WAREHOUSE_PRODUCT_STOCK', res.data);
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
