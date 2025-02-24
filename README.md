# 图片老豆👨

这是一个基于 Next.js 的图床项目，允许用户上传、查看和删除图片。该项目使用 Clerk 进行身份验证，并将图片存储在 Cloudflare R2 中。

## 特性

- 用户可以上传多张图片
- 支持查看和删除已上传的图片
- 使用 Clerk 进行用户身份验证
- 图片存储在 Cloudflare R2 中
- 响应式设计，适配各种设备
- Telegram Bot
- （近乎）全自动部署

## 技术栈

- **前端**: Next.js, React, TypeScript, Tailwind CSS
- **后端**: Next.js + Hono.js
- **数据库**: Cloudflare D1, 使用 Drizzle ORM
- **存储**: Cloudflare R2
- **身份验证**: Clerk



## 环境变量

| 名称                              | 描述                | 是否必须              |
| --------------------------------- | ------------------- | --------------------- |
| NEXT_PUBLIC_APP_URL               | 项目URL地址         | 否（默认 pages 分配） |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk 后台获取      | 是                    |
| CLERK_SECRET_KEY                  | Clerk 后台获取      | 是                    |
| CLOUDFLARE_API_TOKEN              | Cloudflare 用户令牌 | 是                    |
| CLOUDFLARE_ACCOUNT_ID             | Cloudflare 用户 ID  | 是                    |
| DATABASE_NAME                     | D1 数据库名         | 否（默认 image-dad）  |
| BUCKET_DOMAIN                     | R2 存储桶域名       | 是                    |
| BUCKET_NAME                       | R2 存储桶名         | 否（默认 image-dad）  |




## 先决条件

### 准备

确保您已安装以下软件：

- Node.js >= 20
- pnpm

### Cloudflare 准备

在开始部署之前，需要在 Cloudflare 控制台完成以下准备工作：

- 在控制台 -> 右上角 -> “我的个人资料” -> “API 令牌” -> 创建 -> “自定义令牌” -> 创建 -> 具体如下图
  ![API 令牌](https://image-dad-storage.bytespark.app/2025/02/24/6DXVTi.png)
- 想一个存储桶的域名（例如：image-dad-storage.example.com）

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

`pnpm dev:dev-bot`，启动本地 Cloudflare R2 图片服务

`pnpm dev`，打开 [http://localhost:3000](http://localhost:3000)

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

### 部署主应用到 Cloudflare Pages

`pnpm run deploy`

### 设置 R2 存储桶自定义域名

- 在存储桶，选择 “设置” -> “公开访问” -> “自定义域” -> “连接域”

## 贡献

欢迎任何形式的贡献～

提交 Pull Request 或者 Issue 来帮助改进这个项目！
