import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface WranglerConfig {
  vars: Record<string, string>;
}

interface EnvConfig {
  name: string;
  required: boolean;
  validate?: (value: string) => boolean;
  description?: string;
}

const envConfigs: EnvConfig[] = [
  {
    name: "BETTER_AUTH_SECRET",
    required: true,
    description: "用于加密的密钥",
  },
  {
    name: "BETTER_AUTH_URL",
    required: true,
    validate: (value) => value.startsWith("https"),
    description: "应用 URL，必须以 https 开头",
  },
  {
    name: "GITHUB_CLIENT_ID",
    required: true,
    description: "GitHub OAuth 应用 ID",
  },
  {
    name: "GITHUB_CLIENT_SECRET",
    required: true,
    description: "GitHub OAuth 应用密钥",
  },
  {
    name: "ALLOW_EMAILS",
    required: true,
    validate: (value) => value.split(",").every((email) => email.includes("@")),
    description: "允许的邮箱列表，用逗号分隔",
  },
  {
    name: "BUCKET_DOMAIN",
    required: true,
    validate: (value) => value.startsWith("https"),
    description: "存储桶域名，必须以 https 开头",
  },
];

async function setup() {
  console.log("开始设置环境变量...");

  const wranglerJsonPath = join(process.cwd(), "wrangler.json");

  let config: WranglerConfig;

  try {
    const wranglerJson = readFileSync(wranglerJsonPath, "utf8");
    config = JSON.parse(wranglerJson) as WranglerConfig;
  } catch {
    console.error("错误：无法读取或解析 wrangler.json");
    console.error("请确保 wrangler.json 文件存在且格式正确");
    process.exit(1);
  }

  const missingEnvs: string[] = [];
  const invalidEnvs: string[] = [];

  // 检查环境变量
  for (const env of envConfigs) {
    const value = process.env[env.name];

    if (env.required && !value) {
      missingEnvs.push(env.name);
      continue;
    }

    if (value && env.validate && !env.validate(value)) {
      invalidEnvs.push(env.name);
    }
  }

  // 输出错误信息
  if (missingEnvs.length > 0) {
    console.error("缺少必需的环境变量：");
    missingEnvs.forEach((env) => {
      const config = envConfigs.find((e) => e.name === env);
      console.error(`- ${env}: ${config?.description || "必需"}`);
    });
    process.exit(1);
  }

  if (invalidEnvs.length > 0) {
    console.error("环境变量格式错误：");
    invalidEnvs.forEach((env) => {
      const config = envConfigs.find((e) => e.name === env);
      console.error(`- ${env}: ${config?.description || "格式错误"}`);
    });
    process.exit(1);
  }

  // 更新配置
  for (const env of envConfigs) {
    if (process.env[env.name]) {
      config.vars[env.name] = process.env[env.name]!;
      console.log(`✓ 已设置 ${env.name}`);
    }
  }

  try {
    const wranglerJson = JSON.stringify(config, null, 2);
    writeFileSync(wranglerJsonPath, wranglerJson);
    console.log("✓ 配置已保存到 wrangler.json");
  } catch {
    console.error("错误：无法写入 wrangler.json");
    process.exit(1);
  }

  console.log("环境变量设置完成！");
}

setup().catch((error) => {
  console.error("设置过程中发生错误：", error);
  process.exit(1);
});
