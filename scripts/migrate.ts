import { readFileSync } from "fs";
import { join } from "path";
import JSON5 from "json5";
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
    console.error("Please provide a mode: local or remote");
    process.exit(1);
  }

  console.log(`Migrating in ${mode} mode`);

  // Read wrangler.json
  const wranglerJsonPath = join(process.cwd(), "wrangler.json");
  let config: WranglerConfig;

  try {
    const wranglerJson = readFileSync(wranglerJsonPath, "utf8");
    config = JSON5.parse(wranglerJson) as WranglerConfig;
  } catch {
    console.error(
      "Error: Failed to parse wrangler.json or wrangler.json not found"
    );
    process.exit(1);
  }

  if (!config.d1_databases?.[0]?.database_name) {
    console.error("Error: Database name not found in wrangler.toml");
    process.exit(1);
  }

  const dbName = config.d1_databases[0].database_name;

  // Generate migrations
  console.log("Generating migrations...");
  await execAsync("drizzle-kit generate");

  // Apply migrations
  console.log(`Applying migrations to ${mode} database: ${dbName}`);
  await execAsync(`wrangler d1 migrations apply ${dbName} --${mode}`);

  console.log("Migration completed successfully!");
}

migrate();
