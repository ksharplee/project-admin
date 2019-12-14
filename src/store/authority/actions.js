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
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 6501 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  async editDepartmentAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 6502 }, { root: true });
    if (right) {
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
    } else {
      return Promise.reject(new Error('您没有该操作的权限，请联系管理员'));
    }
  },
  async deleteDepartmentAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 6503 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/r/sectionDelete.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getDepartmentListAsync');
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
  // 权限列表
  async getAuthorityListAsync(context, payload) {
    try {
      const res = await axios.post('/r/rightList.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_AUTHORITY_LIST', res.data.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 角色列表
  async getAuthorityRoleListAsync(context, payload) {
    try {
      const res = await axios.post('/p/postList.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_AUTHORITY_ROLE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加角色
  async addAuthorityRoleAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 6521 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/p/postAdd.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getAuthorityRoleListAsync');
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
  // 编辑角色
  async editAuthorityRoleAsync(context, payload) {
    const right = await context.dispatch('checkAuthorityAsync', { rightId: 6522 }, { root: true });
    if (right) {
      try {
        const res = await axios.post('/p/postEdit.html', payload);
        if (res.data.status === 1) {
          await context.dispatch('getAuthorityRoleListAsync');
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
  // 删除角色
  async deleteAuthorityRoleAsync(context, payload) {
    try {
      const res = await axios.post('/p/postDelete.html', payload);
      if (res.data.status === 1) {
        await context.dispatch('getAuthorityRoleListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 角色详情
  async getAuthorityRoleDetailAsync(context, payload) {
    try {
      const res = await axios.post('/p/postDesc.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 员工权限
  async getAuthorityEmployeeRightAsync(context, payload) {
    try {
      const res = await axios.post('/r/descUserRight.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 设置员工权限
  // 请求参数：
  // userId 员工id; 类型：String
  // rangeType: 1 全部 2 自己 3 选部门;类型：String
  // postIds: 角色id[1,2];类型：数组
  // sectionIds: 当 rangeType = 3 必传 部门id;类型：数组
  async setAuthorityEmployeeRightAsync(context, payload) {
    try {
      const res = await axios.post('/r/setUserRight.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 账号权限
  async getAuthorityRoleRightAsync(context, payload) {
    try {
      const res = await axios.post('/p/postBase.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
