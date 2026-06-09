/**
 * DevLog OSS 部署脚本
 * 将 VitePress 构建产物上传到阿里云 OSS
 *
 * 使用方式:
 *   node scripts/deploy.mjs
 *
 * 依赖环境变量（CI 中通过 GitHub Secrets 注入）:
 *   OSS_ACCESS_KEY_ID     — 阿里云 AccessKey ID
 *   OSS_ACCESS_KEY_SECRET — 阿里云 AccessKey Secret
 *   OSS_REGION            — OSS 地域 (如 oss-cn-hangzhou)
 *   OSS_BUCKET            — Bucket 名称
 */

import OSS from 'ali-oss'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, basename, extname } from 'path'
import { execSync } from 'child_process'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, '.vitepress', 'dist')

// ---- 校验环境变量 -----------------------------------------------------------
const required = ['OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET', 'OSS_REGION', 'OSS_BUCKET']
const missing = required.filter(k => !process.env[k])
if (missing.length) {
  console.error('❌ 缺少环境变量:', missing.join(', '))
  console.error('   CI: 在 GitHub Secrets 中配置')
  console.error('   本地: 在 .env 文件中配置 (不要提交到 git)')
  process.exit(1)
}

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
})

// ---- 收集文件 ---------------------------------------------------------------
function collectFiles(dir, baseDir = dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full, baseDir))
    } else {
      files.push({
        local: full,
        remote: relative(baseDir, full).replace(/\\/g, '/'),
      })
    }
  }
  return files
}

// ---- Content-Type 映射 ------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

function mimeType(file) {
  const ext = extname(file).toLowerCase()
  return MIME[ext] || 'application/octet-stream'
}

// ---- 上传 -------------------------------------------------------------------
async function upload() {
  console.log('📦 收集构建产物...')
  if (!statSync(DIST, { throwIfNoEntry: false })) {
    console.error('❌ 构建目录不存在，请先执行 npm run docs:build')
    process.exit(1)
  }

  const files = collectFiles(DIST)
  console.log(`   共 ${files.length} 个文件\n`)

  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const { local, remote } of files) {
    try {
      // 检查文件是否已存在且内容一致（基于 ETag / MD5 对比可优化，这里简单跳过）
      const content = readFileSync(local)
      const headers = {
        'Content-Type': mimeType(local),
        'Cache-Control': remote.endsWith('.html')
          ? 'no-cache'
          : 'public, max-age=31536000, immutable',
      }

      await client.put(remote, content, { headers })
      uploaded++
      console.log(`   ✅ ${remote}`)
    } catch (err) {
      failed++
      console.error(`   ❌ ${remote} — ${err.message}`)
    }
  }

  // ---- 设置静态网站 404 回退 ------------------------------------------------
  // 注意: 404 回退到 index.html 需要在 OSS 控制台「基础设置 → 静态页面」中配置
  // 默认首页: index.html, 默认 404 页: index.html

  console.log(`\n${'='.repeat(50)}`)
  console.log(`   ✅ 上传完成: ${uploaded} | ❌ 失败: ${failed}`)
  console.log(`   🌐 访问地址: https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com`)
  console.log(`${'='.repeat(50)}`)
  console.log('\n⚠️  备案完成后，在 OSS 控制台绑定自定义域名并启用 CDN\n')
}

upload().catch(err => {
  console.error('❌ 部署失败:', err.message)
  process.exit(1)
})
