* 前端项目脚手架

脚手架依赖 nodejs@5.x 及以上和 npm@3.x 及以上，在墙内开发可能需要添加 cnpm 作为镜像源

项目目录
```
|-- /
    |-- .babelrc
    |-- .eslintrc.js ---js语法效验配置文件
    |-- .gitignore
    |-- package-lock.json
    |-- package.json ---依赖包管理配置文件
    |-- readme.md ---项目帮助文档
    |-- webpack.config.js ---项目打包编译配置文件
    |-- src
        |-- index.html  ---项目入口
        |-- config
        |   |-- config.js  ---api配置
        |-- frontend_static ---第三方组件
        |-- images ---图片
        |   |-- static ---静态图片
        |       |-- logo.svg
        |-- less ---样式表
        |   |-- global.less --业务代码
        |   |-- index.less --入口
        |   |-- module-alert.less --简易弹出提示框
        |   |-- module-animate.less --自定义动画
        |   |-- module-btn.less --按钮组
        |   |-- module-checkbox&radio.less --单选&&多选按钮组
        |   |-- module-detail.less --详情
        |   |-- module-dialog.less --弹出层
        |   |-- module-form.less ---表单
        |   |-- module-layout.less ---布局
        |   |-- module-pagination.less ---分页组件
        |   |-- module-side-menu.less ---侧边菜单栏
        |   |-- module-step-to.less ---步骤条
        |   |-- module-tab.less --tab切换
        |   |-- module-table.less ---表格
        |   |-- module-tools-class.less ---基类
        |   |-- reset.less --重置
        |   |-- variabled.less ---全局颜色变量
        |   |-- aw-font ---icon样式表
        |-- public
            |-- app.js --入口
            |-- api
            |   |-- http.js ---api拦截器配置
            |   |-- resource-group.js ---业务api
            |-- common-tmpl ---公共组件
            |   |-- detail.vue ---详情组件
            |   |-- footer.vue 
            |   |-- header.vue
            |   |-- index.vue ---根路由组件
            |   |-- page-query.vue ---分页组件
            |   |-- side.vue ---侧边栏组件
            |-- i18n ---翻译文件
            |   |-- en_US.js
            |   |-- zh_CN.js 
            |-- route ---全局路由配置
            |   |-- route.js
            |-- store ---全局状态管理
            |   |-- actions.js
            |   |-- getters.js
            |   |-- index.js
            |   |-- mutations.js
            |   |-- state.js
            |   |-- resource-group ---业务状态文件
            |       |-- index.js
            |-- utils
            |   |-- utils.js ---工具方法
            |-- validate ---表单验证
            |   |-- local.js
            |   |-- validate.js ---自定义校验规格
            |-- view ---业务视图组件
                |-- asset ---业务一
                    |-- resource-group
                        |-- detail-resource-group.vue
                        |-- option-resource-group.vue
                        |-- resource-group.vue
```

安装好 node 以及 npm 后，在项目根目录安装依赖
```bash
npm i
```


打包编译
```bash
npm run build
```
生成编译出的目标文件到 built 目录


开发模式
```bash
npm run start
```
访问地址：http://localhost:10099/ 可在webpack.config.js中配置端口
