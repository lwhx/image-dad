# 图床项目

这是一个基于 Next.js 的图床项目，允许用户上传、查看和删除图片。该项目使用 Clerk 进行身份验证，并将图片存储在 Cloudflare R2 中。

## 特性

- 用户可以上传多张图片
- 支持查看和删除已上传的图片
- 使用 Clerk 进行用户身份验证
- 图片存储在 Cloudflare R2 中
- 响应式设计，适配各种设备
- Telegram Bot

## 技术栈

- **前端**: Next.js, React, TypeScript, Tailwind CSS
- **后端**: Next.js API 路由
- **数据库**: Cloudflare D1, 使用 Drizzle ORM
- **存储**: Cloudflare R2
- **身份验证**: Clerk

## 先决条件

### 软件准备

确保您已安装以下软件：

- Node.js >= 20
- pnpm

### Cloudflare 准备

在开始部署之前，需要在 Cloudflare 控制台完成以下准备工作：

1. 创建 D1 数据库

  - 登录 Cloudflare 控制台
  - 选择 “存储与数据库” -> “D1 SQL 数据库”
  - 创建一个数据库（例如：image-dad）
  - 记录下数据库名称和数据库 ID，后续配置需要用到

2. 创建 R2 存储桶

  - 登录 Cloudflare 控制台
  - 选择 R2 对象存储 -> “概述”
  - 创建一个存储桶（例如：image-dad）
  - 在刚创建的存储桶，选择 “设置” -> “公开访问” -> “自定义域” -> “连接域”
  - 设置要访问这个存储桶的域名（例如：image-dad-storage.example.com）
  - 记录下存储桶名称，后续配置需要用到

## 本地运行

### 克隆项目

```bash
git clone https://github.com/sdrpsps/image-dad.git
cd image-dad
```

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

将 `.env.example` 复制并重命名为 `.env.development`，填入对应信息

### 初始化数据库

`pnpm db:migrate-local`

### 启动

`pnpm dev`，打开 [http://localhost:3000](http://localhost:3000)

`pnpm dev:dev-bot`，启动本地 Cloudflare R2 图片服务

## 部署

### 克隆项目

```bash
git clone https://github.com/sdrpsps/image-dad.git
cd image-dad
```

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

将 `.env.example` 复制并重命名为 `.env`，填入对应信息

将 `next.config.mjs` - `remotePatterns`，第一个域名修改为存储桶域名

### 初始化数据库

`pnpm db:migrate-remote`

### 部署主应用到 Cloudflare Pages

`pnpm deploy:pages`

## 贡献

欢迎任何形式的贡献～

提交 Pull Request 或者 Issue 来帮助改进这个项目！