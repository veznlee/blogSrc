module.exports = {
    title: '李老表博客',
    description: '前端技术、框架、学习笔记',
    head: [
        ['link', {
            rel: 'icon',
            href: '/img/logo.ico'
        }]
    ],
    themeConfig: {
        nav: [
            {
                text: '主页',
                link: '/'
            },
            {
                text: '文章',
                link: '/article/'
            },
            {
                text: '关于',
                link: '/about/'
            },
            // 链接到网站
            {
                text: 'Github',
                link: 'https://www.github.com/lilaobiao'
            },
        ],
        sidebar:{
            '/article/': [
                ['', '一台电脑上使用多个github账户'],
                ['vuecli3', 'vue-cli3项目配置和开发指南']
            ],
            // 侧边栏在 /about/ 目录上
            '/about/': [
                ['','关于我'],
                ['blog','关于本博客']
            ],
            // fallback
            '/':[
                ''
            ]
        }
    }
}