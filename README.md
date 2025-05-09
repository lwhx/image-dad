# 图片老豆 👨

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
- **身份验证**: Auth.js

## 环境变量

| 名称                | 描述                          | 值             | 是否必须 |
| ------------------- | ----------------------------- | -------------- | -------- |
| AUTH_SECRET         | 用于加密的密钥                | 随机字符串     | 是       |
| AUTH_GITHUB_ID      | GitHub OAuth 应用 ID          | 在 GitHub 获取 | 是       |
| AUTH_GITHUB_SECRET  | GitHub OAuth 应用密钥         | 在 GitHub 获取 | 是       |
| ALLOW_EMAILS        | 允许的邮箱列表，用逗号分隔    |                | 是       |
| NEXT_PUBLIC_APP_URL | 应用 URL，必须以 https 开头   |                | 是       |
| BUCKET_DOMAIN       | 存储桶域名，必须以 https 开头 |                | 是       |
| BOT_OWNERS_ID       | 机器人所有者 ID，必须是数字   |                | 是       |
| BOT_TOKEN           | 机器人 Token                  |                | 是       |

## 先决条件

### 准备

确保您已安装以下软件：

- [bun](https://bun.sh)

## 部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sdrpsps/image-dad)

- 请在 “高级设置” -> “构建变量” 中按要求填入环境变量

### 设置 R2 存储桶自定义域名

- 在存储桶，选择 “设置” -> “公开访问” -> “自定义域” -> “连接域”

## 本地运行

1. 克隆项目

```bash
git clone https://github.com/sdrpsps/image-dad.git
cd image-dad
```

2. 安装依赖

```bash
bun install
```

3. 配置环境变量

将 `.env.example` 复制并重命名为 `.env.development.local`，填入对应信息

新建一个 `.dev.vars` 文件

```bash
touch .dev.vars
```

填入

```txt
NEXTJS_ENV=development
```

4. 初始化数据库

```bash
bun db:migrate-local
```

5. 启动本地 R2 服务

```bash
bun dev:r2
```

6. 启动服务

```bash
bun dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 贡献

欢迎任何形式的贡献～

提交 Pull Request 或者 Issue 来帮助改进这个项目！
