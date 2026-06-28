import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.VITE_BASE || '/',
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
          { text: 'JAVA 学习笔记', link: '/java/JAVA学习笔记' },
          { text: 'JavaSE 笔记', link: '/java/JavaSE' },
          { text: 'Mybatis 笔记', link: '/java/Mybatis' },
          { text: 'Mybatis-Plus 笔记', link: '/java/Mybatis-Plus问题汇总' },
          { text: 'Spring 笔记', link: '/java/Spring' },
          { text: 'Tlias 案例问题', link: '/java/Tlias案例问题' }
        ]
      },
      {
        text: '🗄️ 数据库',
        collapsed: false,
        items: [
          { text: 'MySQL', link: '/database/MySql' },
          { text: 'Redis', link: '/database/Redis' }
        ]
      },
      {
        text: '☁️ 微服务 & 中间件',
        collapsed: false,
        items: [
          { text: 'SpringCloud 中间件', link: '/microservices/SpringCloud中间件' },
          { text: 'RabbitMQ 实践问题', link: '/microservices/RabbitMQ实践问题' }
        ]
      },
      {
        text: '🤖 AI Agent',
        collapsed: false,
        items: [
          { text: 'SpringAI 问题汇总', link: '/ai-agent/SpringAI问题汇总' },
          { text: 'OnCallAgent', link: '/ai-agent/OnCallAgent' },
          { text: 'RAG 知识库检索优化', link: '/ai-agent/RAG知识库检索优化' },
          { text: 'RAG 流程自定义增强', link: '/ai-agent/RAG流程自定义增强' },
          { text: 'AI 客服系统设计', link: '/ai-agent/AI客服系统设计' }
        ]
      },
      {
        text: '🔧 工具',
        collapsed: false,
        items: [
          { text: 'Git 核心概念', link: '/tools/Git 核心概念与操作总结' },
          { text: 'Docker 笔记', link: '/tools/Docker' }
        ]
      },
            {
        text: '登录鉴权 & 网站攻击',
        collapsed: false,
        items: [
          { text: '网站攻击方式', link: '/security/web-attack' },
          { text: '登录鉴权', link: '/security/login-authentication' }
        ]
      },
      {
        text: '🎨 前端',
        collapsed: false,
        items: [
          { text: 'Vue 开发笔记', link: '/frontend/Vue开发' },
          { text: 'JavaWeb 学习笔记', link: '/frontend/JavaWeb学习笔记' }
        ]
      },
      {
        text: '🐍 Python',
        collapsed: false,
        items: [
          { text: 'Python 基础', link: '/python/Python基础' }
        ]
      },
      {
        text: '📁 项目',
        collapsed: false,
        items: [
          { text: 'Furbaby-Inn 项目', link: '/project/Furbaby-Inn' }
        ]
      },
      {
        text: '📒 参考',
        collapsed: true,
        items: [
          { text: 'Markdown 语法参考', link: '/reference/markdown-examples' },
          { text: 'VitePress 初始化教程', link: '/reference/VitePress初始化教程' },
          { text: 'OSS 部署教程', link: '/reference/OSS部署教程' },
          { text: 'Cloudflare 加速教程', link: '/reference/Cloudflare加速教程' }
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
