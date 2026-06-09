# VitePress 博客部署到阿里云 OSS + GitHub Actions

[[TOC]]

## 为什么选 OSS？

VitePress 生成的是纯静态站点（HTML/CSS/JS），不需要服务器端运行环境。OSS + CDN 是最优解：

| 对比 | OSS + CDN | 云服务器 |
|------|-----------|----------|
| 费用 | 按量付费，小博客几乎免费 | 最低 50-100 元/月 |
| 运维 | 零运维 | 需要配 nginx、HTTPS、安全组 |
| 性能 | CDN 全国加速 | 单点，除非再套 CDN |
| HTTPS | 控制台一键 | 手动部署证书 |

---

## 一、创建 OSS Bucket

### 1. 登录阿里云控制台

进入 [对象存储 OSS](https://oss.console.aliyun.com/) → **Bucket 列表** → **创建 Bucket**

### 2. 配置项

| 配置项 | 值 |
|--------|-----|
| Bucket 名称 | `devlog-blog`（全局唯一，按实际填） |
| 地域 | **华东1（杭州）** `oss-cn-hangzhou` — 离你近延迟低 |
| 读写权限 | **公共读** — 博客需要对外公开 |
| 版本控制 | 关闭（静态博客不需要） |

### 3. 开启静态网站托管

进入 Bucket → **数据管理** → **静态页面**：

- 默认首页：`index.html`
- 默认 404 页：`index.html`

> ⚠️ VitePress 是 SPA 路由，404 回退到 `index.html` 是关键步骤！

记下你的访问端点：
```
https://<bucket名称>.oss-cn-hangzhou.aliyuncs.com
```

---

## 二、获取 AccessKey

> ⚠️ 不要用主账号 AccessKey！用 RAM 子账号，权限最小化。

### 1. 创建 RAM 用户

进入 [RAM 访问控制](https://ram.console.aliyun.com/) → **身份管理** → **用户** → **创建用户**

- 登录名称：`devlog-deploy`
- 显示名称：`DevLog 部署用户`
- 勾选 **OpenAPI 调用访问**（会生成 AccessKey ID 和 Secret）

### 2. 授权

用户创建完成后 → **添加权限** → 选择 **AliyunOSSFullAccess**

### 3. 保存密钥

> 🔒 **这个页面关闭后就看不到 Secret 了！**  
> 立即复制保存 **AccessKey ID** 和 **AccessKey Secret**。

---

## 三、配置 GitHub Secrets

进入你的 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

逐个添加 4 个 Secret：

| Secret 名 | 值 | 说明 |
|-----------|-----|------|
| `OSS_ACCESS_KEY_ID` | `LTAI5t...` | 上一步的 AccessKey ID |
| `OSS_ACCESS_KEY_SECRET` | `abc123...` | 上一步的 AccessKey Secret |
| `OSS_REGION` | `oss-cn-hangzhou` | OSS 地域 |
| `OSS_BUCKET` | `devlog-blog` | Bucket 名称 |

---

## 四、部署流程说明

### 自动部署（推荐）

推送代码到 `main` 分支 → GitHub Actions 自动触发：

```
代码推送 → Checkout → 安装依赖 → VitePress Build → 上传 OSS
```

整个流程约 30-60 秒，在仓库的 **Actions** 标签页可查看日志。

### 工作流文件

[.github/workflows/deploy.yml](https://github.com/YYYWork1209/DevLog/blob/main/.github/workflows/deploy.yml)：

```yaml
name: Deploy to Alibaba Cloud OSS

on:
  push:
    branches: [main]
  workflow_dispatch:  # 支持手动触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run docs:build
      - run: node scripts/deploy.mjs
        env:
          OSS_ACCESS_KEY_ID: ${{ secrets.OSS_ACCESS_KEY_ID }}
          OSS_ACCESS_KEY_SECRET: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
          OSS_REGION: ${{ secrets.OSS_REGION }}
          OSS_BUCKET: ${{ secrets.OSS_BUCKET }}
```

### 手动部署（本地）

复制 `.env.example` 为 `.env`，填入真实密钥后执行：

```bash
npm run deploy
```

---

## 五、绑定自定义域名（备案通过后）

### 1. 添加域名

OSS 控制台 → Bucket → **传输管理** → **域名管理** → **绑定域名**

填写 `blog.yourdomain.com`

### 2. DNS 解析

在域名 DNS 处添加 CNAME 记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| CNAME | `blog` | `<bucket>.oss-cn-hangzhou.aliyuncs.com` |

### 3. 开启 CDN 加速

建议开启阿里云 CDN 加速（全站加速 DCDN），HTTPS 证书一键配置。

---

## 六、常见问题

### Q: 部署后页面 404？

检查 OSS 静态页面设置中的 **默认 404 页** 是否为 `index.html`。

### Q: 上传成功了但图片/CSS 不显示？

检查 OSS Bucket 权限是否为 **公共读**，以及 Content-Type 是否正确。

### Q: GitHub Actions 连不上阿里云 OSS？

部署脚本使用的是 OSS API 公网域名，GitHub Actions 海外节点直连没问题。

---

## 相关文件

| 文件 | 作用 |
|------|------|
| [scripts/deploy.mjs](https://github.com/YYYWork1209/DevLog/blob/main/scripts/deploy.mjs) | OSS 上传脚本 |
| [.github/workflows/deploy.yml](https://github.com/YYYWork1209/DevLog/blob/main/.github/workflows/deploy.yml) | CI/CD 工作流 |
| [.env.example](https://github.com/YYYWork1209/DevLog/blob/main/.env.example) | 本地环境变量模板 |
