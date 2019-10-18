import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  // 商品分类
  async getCateListAsync(context) {
    try {
      const res = await axios.post('/cate/cate_lists.html');
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_CATEGORY', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addCateAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_add.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_CATEGORY', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editCateAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_edit.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_CATEGORY', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteCateAsync(context, payload) {
    try {
      const res = await axios.post('/cate/del_category.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_CATEGORY', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品分类规格
  async getCateSpecListAsync(context, payload) {
    try {
      const res = await axios.post('/cate/category_spec_list.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addCateSpecAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_spec_add.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editCateSpecAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_spec_edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteCateSpecAsync(context, payload) {
    try {
      const res = await axios.post('/cate/del_category_spec.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品分类属性
  async getCateAttrListAsync(context, payload) {
    try {
      const res = await axios.post('/cate/category_attr_list.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addCateAttrAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_attr_add.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editCateAttrAsync(context, payload) {
    try {
      const res = await axios.post('/cate/do_category_attr_edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteCateAttrAsync(context, payload) {
    try {
      const res = await axios.post('/cate/del_category_attr.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 获取产品分类属性和规格
  async getCateAttrSpecAsync(context, payload) {
    try {
      const res = await axios.post('/cate/category_attr_spec_list.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品品牌
  async addOrEditBrandAsync(context, payload) {
    try {
      const res = await axios.post('/brand/add_save_brand.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getBrandListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteBrandAsync(context, payload) {
    try {
      const res = await axios.post('/brand/del_brand.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getBrandListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getBrandListAsync(context, payload) {
    try {
      const res = await axios.post('/brand/brand_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_BRAND', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品单位
  async addOrEditUnitsAsync(context, payload) {
    try {
      const res = await axios.post('/unit/add_save.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getUnitsListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteUnitsAsync(context, payload) {
    try {
      const res = await axios.post('/unit/del_unit.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getUnitsListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getUnitsListAsync(context, payload) {
    try {
      const res = await axios.post('/unit/unit_lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_UNITS', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加商品
  async addProductAsync(context, payload) {
    try {
      const res = await axios.post('/g/add.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getProductListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除商品
  async deleteProductAsync(context, payload) {
    try {
      const res = await axios.post('/g/delete.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getProductListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 上下架商品
  async operateProductAsync(context, payload) {
    try {
      const res = await axios.post('/g/setVisible.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getProductListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品列表
  async getProductListAsync(context, payload) {
    try {
      const res = await axios.post('/g/lists.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.productList.data.timeLimit,
        p: context.state.productList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_PRODUCT_LIST', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品修改详情
  async getProductDetailEditAsync(context, payload) {
    try {
      const res = await axios.post('/g/detailEdit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 商品修改详情
  async getProductDetailAsync(context, payload) {
    try {
      const res = await axios.post('/g/detail.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 编辑商品
  async editProductAsync(context, payload) {
    try {
      const res = await axios.post('/g/edit.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 编辑商品标签
  async setProductLabelAsync(context, payload) {
    try {
      const res = await axios.post('/g/setLabel.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getProductListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
