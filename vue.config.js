const { defineConfig } = require('@vue/cli-service')
const path = require('path')// 拼接路径
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 把你需要注入的文件配置一下后，重启服务即可。
        // 使用绝对路径
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    },
    // 需要配置10kb下的图片打包成base64的格式
    chainWebpack: config => {
      // 图片加载
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 10000 }))
        // 这个是给webpack-dev-server开启可IP和域名访问权限。
      // config.devServer.disableHostCheck(true)废弃了
    }

  },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  // # 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  // 由于版本问题，上面的不生效用下面的

  // 打包时排除qc包,(如果不配置此项，在引入的时候会出现找不到qc)
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
