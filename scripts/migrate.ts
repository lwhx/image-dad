import { readFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

type MigrateMode = ["local", "remote"];

interface D1Database {
  binding: string;
  database_name: string;
  database_id: string;
}

interface WranglerConfig {
  d1_databases: D1Database[];
}

const execAsync = promisify(exec);

async function migrate() {
  // Get the mode from the command line arguments
  const args = process.argv.slice(2) as MigrateMode;
  const mode = args[0];

  if (!mode || !["local", "remote"].includes(mode)) {
    console.error("请提供一个模式: local 或 remote");
    process.exit(1);
  }

  console.log(`在 ${mode} 模式下迁移`);

  // Read wrangler.json
  const wranglerJsonPath = join(process.cwd(), "wrangler.json");
  let config: WranglerConfig;

  try {
    const wranglerJson = readFileSync(wranglerJsonPath, "utf8");
    config = JSON.parse(wranglerJson) as WranglerConfig;
  } catch {
    console.error("错误: 无法解析 wrangler.json 或 wrangler.json 未找到");
    process.exit(1);
  }

  if (!config.d1_databases?.[0]?.database_name) {
    console.error("错误: 未找到 wrangler.toml 中的数据库名称");
    process.exit(1);
  }

  const dbName = config.d1_databases[0].database_name;

  // Generate migrations
  console.log("生成迁移...");
  await execAsync("drizzle-kit generate");

  // Apply migrations
  console.log(`应用迁移到 ${mode} 数据库: ${dbName}`);
  await execAsync(`wrangler d1 migrations apply ${dbName} --${mode}`);

  console.log("迁移完成！");
}

migrate();
