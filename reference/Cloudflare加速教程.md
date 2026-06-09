# Cloudflare CDN 加速 GitHub Pages

[[TOC]]

## 架构说明

```
用户(国内) → Cloudflare 边缘(香港/新加坡) → GitHub Pages(美国)
               ↑ 静态文件缓存到这里，不用每次跨国
```

备案前无法用国内 CDN，Cloudflare 的亚洲边缘节点是最优解。

---

## 一、注册 Cloudflare

1. 打开 [cloudflare.com](https://www.cloudflare.com/)
2. 注册账号 → **Add a site** → 输入 `yyywork.top`
3. 选 **Free** 套餐 → Continue

---

## 二、修改 DNS 托管

Cloudflare 会给你两个**新的 NS 服务器地址**，类似：

```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

去**阿里云域名控制台** → 找到 `yyywork.top` → **DNS 修改** → **修改 DNS 服务器**，把原来的阿里云 DNS 替换成 Cloudflare 给的两个地址。

> ⚠️ NS 修改后全球生效需要 0-48 小时，通常几小时内完成。期间网站不会中断。

---

## 三、配置 DNS 记录

NS 生效后，在 Cloudflare 控制台 → `yyywork.top` → **DNS** → **Records**：

| 类型 | 名称 | 目标 | 代理状态 |
|------|------|------|----------|
| CNAME | `www` | `yyywork1209.github.io` | 🟠 橙色云朵（已代理） |

> 🟠 橙色云朵 = Cloudflare 代理流量，CDN 生效  
> ⬜ 灰色云朵 = 仅 DNS 解析，CDN 不生效

---

## 四、SSL/TLS 设置

Cloudflare → `yyywork.top` → **SSL/TLS** → Overview：

| 配置 | 值 |
|------|-----|
| SSL/TLS 加密模式 | **Full** |
| Always Use HTTPS | ✅ 开启 |

选 **Full** 而不是 Flexible，因为 GitHub Pages 本身支持 HTTPS。

---

## 五、缓存规则

Cloudflare → **Caching** → **Cache Rules** → Create rule：

| 条件 | 设置 |
|------|------|
| URI path 包含 `/assets/` | **Cache: Eligible for cache**，Edge TTL: **1 month** |

VitePress 打包后的 JS/CSS 文件名带 hash，永远不会变，缓存一个月没问题。

HTML 文件 Cloudflare 默认不缓存，保持即可——不需要额外配置。

---

## 六、验证

全部配完后：

```bash
curl -I https://www.yyywork.top
```

响应头中出现 `server: cloudflare` 即表示 CDN 生效。

---

## 相关链接

- [Cloudflare 官方文档](https://developers.cloudflare.com/)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
