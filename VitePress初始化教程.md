# 安装VitePress
- 新建一个项目文件夹，使用
  ``` npm add -D vitepress ```
  进行配置
  > - npm add -D 安装的依赖只用于当前文件夹下的项目
  > 它会安装到当前项目的 node_modules 中，不会影响其他项
  > 目。
  >
  > - 仅作为开发时使用
  > 这些包通常用于开发阶段（如测试、编译、打包工具等），生产
  > 环境不需要(编译打包时，只有代码中引入的依赖包才会被一并打包)。
  >
  > - 其他文件夹想使用必须再次安装
  > 每个项目的依赖都是独立的，换一个项目就要重新安装。
- 执行初始化命令，让`VitePress`帮我们搭建一个基础的框架
  ```
  vitepress init 
      
  D:\DevLog>npx vitepress init

  T  Welcome to VitePress!
  |
  o  Where should VitePress initialize the config?
  |  ./
  |
  o  Site title:
  |  DevLog
  |
  o  Site description:
  |  每天一点进步，分享我在编程路上的踩坑与收获
  |
  o  Theme:
  |  Default Theme + Customization
  |
  o  Use TypeScript for config and theme files?
  |  No
  |
  o  Add VitePress npm scripts to package.json?
  |  Yes
  |
  —  Done! Now run npm run docs:dev and start writing.

  Tips:
  - Since you've chosen to customize the theme, you should also explicitly install vue as a dev dependency.

  D:\DevLog>```

# 提交到远程仓库使用git进行管理
需要忽略的文件如下
```  
        4. 当前项目结构
            D:\DevLog\
            ├── .git/
            ├── .gitignore           ✅ 已检查修复
            ├── .vitepress/
            │   ├── cache/           ❌ 不提交
            │   ├── config.mjs       标题: DevLog | 描述: 后端技术日志
            │   └── theme/
            ├── node_modules/        ❌ 不提交
            ├── index.md             首页
            ├── api-examples.md
            ├── markdown-examples.md
            ├── VitePress初始化教程.md
            ├── package.json
            └── package-lock.json 
```

