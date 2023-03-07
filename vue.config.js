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
    }
  }
})
