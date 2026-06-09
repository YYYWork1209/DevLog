import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DevLog",
  description: "后端技术日志",
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' }
    ],

    sidebar: [
      {
        text: '☕ Java',
        collapsed: false,
        items: [
          { text: 'JavaSE 笔记', link: '/JavaSE' },
          { text: 'Mybatis 笔记', link: '/Mybatis' },
          { text: 'Mybatis-Plus 问题汇总', link: '/Mybatis-Plus问题汇总' },
          { text: 'Spring 笔记', link: '/Spring' }
        ]
      },
      {
        text: '🗄️ 数据库',
        collapsed: false,
        items: [
          { text: 'MySQL 面试题', link: '/MySql面试题' },
          { text: 'Redis 面试', link: '/Redis面试' }
        ]
      },
      {
        text: '☁️ 微服务 & 中间件',
        collapsed: false,
        items: [
          { text: 'SpringCloud 中间件', link: '/SpringCloud中间件' }
        ]
      },
      {
        text: '🤖 AI Agent',
        collapsed: false,
        items: [
          { text: 'SpringAI 问题汇总', link: '/SpringAI问题汇总' },
          { text: 'OnCallAgent', link: '/OnCallAgent' },
          { text: 'RAG 知识库检索优化', link: '/RAG知识库检索优化' }
        ]
      },
      {
        text: '🔧 工具',
        collapsed: false,
        items: [
          { text: 'Git 核心概念', link: '/Git 核心概念与操作总结' }
        ]
      },
      {
        text: '📒 参考',
        collapsed: true,
        items: [
          { text: 'Markdown 语法参考', link: '/markdown-examples' },
          { text: 'VitePress 初始化教程', link: '/VitePress初始化教程' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.328 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84H427.552c-13.952 0-25.28-11.36-25.28-25.28v-328.64c0-13.952 11.328-25.28 25.28-25.28h343.616c13.952 0 25.28 11.328 25.28 25.28v126.4c0 13.952-11.328 25.28-25.28 25.28v0.032zM350.272 570.368H237.28c-13.952 0-25.28 11.328-25.28 25.28v227.424c0 13.952 11.328 25.28 25.28 25.28h113.024c13.952 0 25.28-11.328 25.28-25.28V595.648a25.28 25.28 0 0 0-25.28-25.28z"/></svg>' }, link: 'https://gitee.com/YYYWork' }
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 DevLog · 后端技术日志'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://gitee.com/YYYWork/dev-log/edit/main/:path',
      text: '在 Gitee 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言'
  }
})
