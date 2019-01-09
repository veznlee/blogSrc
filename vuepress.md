- docs                   - VuePress 存放目录
 - .vuepress             - VuePress 配置目录
  - public               - 共用文件存储目录
   - img                 - 共用图片目录
    - banner.png         - 图片-首页 banner
    - logo.ico           - 图片-网站右上角小图标
  - config.js            - VuePress 的 js 配置文件
 - listOne               - 侧边栏项目组1
  - pageOne.md           - 项目组1页面1
  - README.md            - 项目组1默认页面
 - listTwo               - 侧边栏项目组2
  - pageThree.md         - 项目组2页面3
  - pageTwo.md           - 项目组2页面2
  - README.md            - 项目组2默认页面
 - README.md             - 网站默认首页
+ node_modules           - node 依赖包
- package.json           - webpack 配置文件

 其中，.vuepress 存放 VuePress 的配置目录，public 中存放共有的文件，config.js 为 VuePress 的配置文件，listOne、listTwo 是侧边栏组，对页面进行个分类。