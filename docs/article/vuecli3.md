# 关于vue-cli3的项目配置和一些开发建议

## 环境依赖
1. 要有node，webpack，全局安装最新的vue-cli cnpm install -g @vue/cli


## 创建项目
1. 切换到需要创建项目的文件夹，执行命令 vue create xxx，选择相关配置项，直到项目初始完成
> 如果对通过命令创建不熟悉，可以通过命令 vue ui 打开视图面板，进行可视化的项目创建

2. 切换到项目目录 xxx 下，执行命令 npm run serve 即可启动项目

3. vue add xxx 可以安装插件（只有使用过vue封装且存在的才会安装成功），但可能会改变你已有的代码，虽然智能，慎用


## 项目配置
1. vue-cli 3.x 版本和 2.x 相差很大，所有的配置都通过一个配置文件进行，在根目录添加 vue.config.js 文件，进行项目配置：

```
// 用于做相应的合并处理
const merge = require('webpack-merge');

console.log(process.env); // development（在终端输出）

module.exports = {
    //baseUrl: 'vue',// 改变 webpack 配置文件中 output 的 publicPath 项
    outputDir: 'dist', // 输出文件夹，默认dist
    productionSourceMap: true, // 该配置项用于设置是否为生产环境构建生成 source map

    // config 参数为已经解析好的 webpack 配置
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('url-loader')
            .tap(options =>
                merge(options, {
                  limit: 5120,
                })
            )
    },

    // 除了上述使用 chainWebpack 来改变 webpack 内部配置外，我们还可以使用 configureWebpack 来进行修改，
    // 两者的不同点在于 chainWebpack 是链式修改，而 configureWebpack 更倾向于整体替换和修改。示例代码如下：
    // configureWebpack 可以直接是一个对象，也可以是一个函数
    // configureWebpack: config => {
    //     // config.plugins = []; // 这样会直接将 plugins 置空
    //     // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
    //     return {
    //         plugins: []
    //     }
    // },

    // devServer: { //这里面的某一配置项不受支持
    //     open: true, // 是否自动打开浏览器页面
    //     host: '127.0.0.1', // 指定使用一个 host。默认是 localhost
    //     port: 8080, // 端口地址
    //     https: false, // 使用https提供服务
    //     proxy: null, // string | Object 代理设置
    // }
}
```

具体配置可参考：[https://github.com/vuejs/vue-cli/blob/ce3e2d475d63895cbb40f62425bb6b3237469bcd/docs/zh/config/README.md](https://github.com/vuejs/vue-cli/blob/ce3e2d475d63895cbb40f62425bb6b3237469bcd/docs/zh/config/README.md)

> 你可以在项目目录下运行 vue inspect 来查看你修改后的 webpack 完整配置，当然你也可以缩小审查范围，比如：

```
# 只查看 plugins 的内容
vue inspect plugins
```

2. 各种环境配置

一般一个项目都会有以下 3 种环境：
> a. 开发环境（开发阶段，本地开发版本，一般会使用一些调试工具或额外的辅助功能）<br/>
> b. 测试环境（测试阶段，上线前版本，除了一些 bug 的修复，基本不会和上线版本有很大差别）<br/>
> c. 生产环境（上线阶段，正式对外发布的版本，一般会进行优化，关掉错误报告）

这就需要我们进行正确的环境配置和管理，我们可以在根目录下创建以下形式的文件进行不同环境下变量的配置：
> .env                # 在所有的环境中被载入<br/>
> .env.local          # 在所有的环境中被载入，但会被 git 忽略<br/>
> .env.[mode]         # 只在指定的模式中被载入<br/>
> .env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略<br/>

.env.[mode].local 会覆盖 .env.[mode] 下的相同配置。同理 .env.local 会覆盖 .env 下的相同配置。
由此可以得出结论，相同配置项的权重：.env.[mode].local > .env.[mode] > .env.local > .env 


比如我们创建一个名为 .env.stage 的文件，该文件表明其只在 stage 环境下被加载，在这个文件中，我们可以配置如下键值对的变量：

```
NODE_ENV=stage
VUE_APP_TITLE=stage mode
```

这时候我们怎么在 vue.config.js 中访问这些变量呢？很简单，使用 process.env.[name] 进行访问就可以了，比如：

```
// vue.config.js
console.log(process.env.NODE_ENV); // development（在终端输出）
```

当你运行 yarn serve 命令后会发现输出的是 development，因为 vue-cli-service serve 命令默认设置的环境是 development，你需要修改 package.json 中的 serve 脚本的命令为：

```
"scripts": {
    "serve": "vue-cli-service serve --mode stage",
}
```

--mode stage 其实就是修改了 webpack 4 中的 mode 配置项为 stage，同时其会读取对应 .env.[model] 文件下的配置，如果没找到对应配置文件，其会使用默认环境 development，同样 vue-cli-service build 会使用默认环境 production。


3. 环境注入
在环境配置文件中定义的变量，在 vue.config.js 中，可以通过 process.env 获得，但是到了真正的业务代码js中，只能获取环境配置文件中以 VUE_APP_ 开头的变量（NODE_ENV 和 BASE_URL 这两个特殊变量除外）
例：
.env.stage.local 文件中写入：
```
NODE_ENV=stage2
VUE_APP_TITLE=stage mode2
NAME=vue
```

vue.config.js 中打印 process.env，终端输出：
```
{
    ...

    npm_package_dependencies_vue_router: '^3.0.1',
    npm_config_version_tag_prefix: 'v',
    npm_node_execpath: '/usr/local/bin/node',
    NODE_ENV: 'stage2', //来自配置文件的变量
    VUE_APP_TITLE: 'stage mode2', //来自配置文件的变量
    NAME: 'vue', //来自配置文件的变量
    BABEL_ENV: 'development',
    
    ...
}
```

但是我们在入口文件 main.js 中打印会发现输出：
```
{
    "BASE_URL": "/vue/",
    "NODE_ENV": "stage2",
    "VUE_APP_TITLE": "stage mode2"
}
```
可见注入时过滤调了非 VUE_APP_ 开头的变量，其中多出的 BASE_URL 为你在 vue.config.js 设置的值，默认为 /，其在环境配置文件中设置无效。
本项目可通过 npm run serve-stage 查看效果。


4. 额外配置
.env 这样的配置文件中的参数目前只支持静态值，无法使用动态参数，在某些情况下无法实现特定需求，
这时候我们可以在根目录下新建 config 文件夹用于存放一些额外的配置文件。
```
/* 配置文件 index.js */
// 公共变量
const com = {
    IP: JSON.stringify('xxx')
};

module.exports = {
    // 开发环境变量
    dev: {
    	env: {
            TYPE: JSON.stringify('dev'),
            ...com // es6语法
    	}
    },
    
    // 生产环境变量
    build: {
    	env: {
            TYPE: JSON.stringify('prod'),
            ...com
    	}
    }
}
```

现在我们要在 vue.config.js 里注入这些变量，我们可以使用 chainWebpack 修改 DefinePlugin 中的值：

```
/* vue.config.js */
// 用于做相应的 merge 处理
const merge = require('webpack-merge');

// 根据环境判断使用哪份配置
const configs = require('./config');
const cfg = process.env.NODE_ENV === 'production' ? configs.build.env : configs.dev.env;

module.exports = {
    ...
    
    chainWebpack: config => {
        config.plugin('define')
            .tap(args => {
                // 把动态配置合并到process.env
                let name = 'process.env';
                
                // 使用 merge 合并，保证原始值不变
                args[0][name] = merge(args[0][name], cfg);
    
                return args
            })
    },
	
    ...
}
```

最后我们可以在客户端业务代码js中访问包含动态配置的对象：
```
console.log(process.env)
{
    "NODE_ENV": "stage2",
    "VUE_APP_TITLE": "stage mode2",
    "BASE_URL": "/vue/",
    "TYPE": "dev",
    "IP": "xxx"
}
```

5. 路由优化
使用 require.ensure() 实现按需加载，只有访问到了该页面才会加载对应路由的内容 require.ensure 参考链接[https://webpack.js.org/api/module-methods/#require-ensure](https://webpack.js.org/api/module-methods/#require-ensure)

```
/* router.js */
import Vue from 'vue'
import Router from 'vue-router'

// 引入 Home 组件
const Home = resolve => {
    require.ensure(['./views/Home.vue'], () => {
        resolve(require('./views/Home.vue'))
    })
}

// 引入 About 组件
const About = resolve => {
    require.ensure(['./views/About.vue'], () => {
        resolve(require('./views/About.vue'))
    })
}

Vue.use(Router)

let base = `${process.env.BASE_URL}` // 动态获取二级目录

export default new Router({
    mode: 'history',
    base: base,
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    }, {
        path: '/about',
        name: 'about',
        component: About
    }]
})
```

6. 更好的store层级划分
```
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── moduleA.js    # A模块
        └── moduleB.js    # B模块
```

moduleA.js
```
const moduleA = {
    state: { 
        text: 'hello'
    },
    mutations: {
        addText (state, txt) {
            // 这里的 `state` 对象是模块的局部状态
            state.text += txt
        }
    },
    
    actions: {
        setText ({ commit }) {
            commit('addText', ' world')
        }
    },

    getters: {
        getText (state) {
            return state.text + '!'
        }
    }
}

export default moduleA
```

index.js 
```
import Vue from 'vue'
import Vuex from 'vuex'
import moduleA from './modules/moduleA'
import moduleB from './modules/moduleB'
import { mutations } from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        groups: [1]
    },
    modules: {
        moduleA, // 引入 A 模块
        moduleB, // 引入 B 模块
    },
    actions, // 根级别的 action
    mutations, // 根级别的 mutations
    
    // 根级别的 getters
    getters: {
        getGroups (state) {
            return state.groups
        }
    }   
})
```


7. 如果需要去掉eslint检查，操作如下
在 package.json 文件中，找到 eslintConfig ，如下
```
{
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended" // eslint配置，去掉即可
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
},
```
去掉extends里面的eslint项，如果代码不是热更新，需重新启动才生效