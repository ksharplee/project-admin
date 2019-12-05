// vue.config.js

module.exports = {
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      sass: {
        data: '@import "~@/sass/main.scss"',
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  productionSourceMap: false,
};
