import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from 'vuetify/es5/locale/zh-Hans';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#03a9f4',
        secondary: '#607d8b',
        accent: '#3f51b5',
        error: '#f44336',
        warning: '#ff5722',
        info: '#ffeb3b',
        success: '#43A047',
      },
    },
  },
  lang: {
    locales: { zhHans },
    current: 'zh-Hans',
  },
  icons: {
    iconfont: 'mdi',
  },
});
