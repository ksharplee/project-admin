import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  async getInfoCategoriesAsync(context, payload) {
    try {
      const res = await axios.post('/i/categoryLists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_INFO_CATEGORIES', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getInfoListAsync(context, payload) {
    try {
      const res = await axios.post('/i/lists.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_INFO_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addInfoAsync(context, payload) {
    try {
      const res = await axios.post('/i/add.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInfoListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editInfoAsync(context, payload) {
    try {
      const res = await axios.post('/i/edit.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInfoListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteInfoAsync(context, payload) {
    try {
      const res = await axios.post('/i/delete.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInfoListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getNewsListAsync(context, payload) {
    try {
      const res = await axios.post(
        '/n/lists.html',
        R.mergeRight(
          {
            pageSize: process.env.VUE_APP_PAGESIZE,
            timeLimit: context.state.newsList.data.timeLimit,
            p: context.state.newsList.data.p,
          },
          payload
        )
      );
      if (res.data.status === 1) {
        context.commit('SET_NEWS_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getNewsDetailAsync(context, payload) {
    try {
      const res = await axios.post('/n/detail.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addNewsAsync(context, payload) {
    try {
      const res = await axios.post('/n/add.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getNewsListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async editNewsAsync(context, payload) {
    try {
      const res = await axios.post('/n/edit.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getNewsListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteNewsAsync(context, payload) {
    try {
      const res = await axios.post('/n/delete.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInfoListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },

};
