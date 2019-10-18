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
};
