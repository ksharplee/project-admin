import axios from 'axios';
import qs from 'qs';

// 响应时间
axios.defaults.timeout = 10000;
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 配置接口地址
axios.defaults.baseURL = process.env.VUE_APP_API;
axios.defaults.withCredentials = true;
// 每次请求携带cookie信息
// // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做某件事
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `POST ${config.baseURL}${config.url}: ${JSON.stringify(config.data)}`,
        );
      }
      return config;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`POST ${config.url}: ${JSON.stringify(config.data)}`);
    }
    config.data = qs.stringify(config.data);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
  ,
);

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  (res) => {
    // console.log(`data return: ${JSON.stringify(res)}`);
    // 对响应数据做些事
    if (!res.data.success) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`RETURN ${res.config.url}`, res.data);
      }
      return Promise.resolve(res);
    }
    return res;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }
    if (error.message.includes('timeout')) {
      error.message = '连接超时，请检查网络状况并刷新';
    }
    return Promise.reject(error);
  },
);

export default axios;
