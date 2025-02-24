import "dotenv/config";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const PROJECT_NAME = process.env.PROJECT_NAME || "image-dad";
const DB_NAME = process.env.DATABASE_NAME || "image-dad";

const validateEnvironment = () => {
  const requiredEnvVars = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"];
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

const setupWranglerConfig = () => {
  const wranglerConfigPath = resolve("wrangler.json");
  const wranglerExamplePath = resolve("wrangler.example.json");

  try {
    readFileSync(wranglerConfigPath, "utf-8");
    console.log("✨ Wrangler configuration already exists.");
  } catch {
    const wranglerConfig = readFileSync(wranglerExamplePath, "utf-8");
    const json = JSON.parse(wranglerConfig);
    json.d1_databases[0].database_name = DB_NAME;
    json.r2_buckets[0].bucket_name = DB_NAME;
    writeFileSync(wranglerConfigPath, JSON.stringify(json, null, 2));
    console.log("✅ Wrangler configuration setup successfully.");
  }
};

// Check if the Cloudflare Pages project exists
const checkProjectExists = async () => {
  console.log(`🔍 Checking if project "${PROJECT_NAME}" exists...`);
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok && response.status === 404) {
      console.log("⚠️ Project not found, creating new project...");
      await createPages();
    } else {
      console.log("✅ Project already exists, proceeding with update...");
    }
  } catch (error) {
    console.error("❌ Failed to check project existence:", error);
    throw error;
  }
};

// Create Cloudflare pages
const createPages = async () => {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: PROJECT_NAME,
          production_branch: "main",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error creating pages: ${response.statusText}`);
    }

    const data = (await response.json()) as { success: boolean };

    if (!data.success) {
      throw new Error("Failed to create pages");
    }

    console.log("✅ Pages created successfully");
  } catch (error) {
    throw error;
  }
};

const pushPagesSecret = () => {
  console.log("🔐 Pushing environment secrets...");
  try {
    execSync(`wrangler pages secret bulk .env`);
    console.log("✅ Secrets pushed successfully");
  } catch (error) {
    console.error("❌ Failed to push secrets:", error);
    throw error;
  }
};

const getDatabaseId = () => {
  const dbList = execSync("wrangler d1 list --json").toString();
  const databases = JSON.parse(dbList);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return databases.find((db: any) => db.name === DB_NAME)?.uuid;
};

const checkAndCreateDatabase = () => {
  console.log("🔍 Checking database status...");
  let dbId;

  try {
    dbId = getDatabaseId();
  } catch (error) {
    console.error("❌ Error listing databases:", error);
    throw error;
  }

  if (!dbId) {
    console.log(`🆕 Creating new D1 database: "${DB_NAME}"`);
    try {
      execSync(`wrangler d1 create "${DB_NAME}"`);
      dbId = getDatabaseId();
      if (!dbId) {
        throw new Error("Failed to create database");
      }
      console.log("✅ Database created successfully");
    } catch (error) {
      console.error("❌ Failed to create database:", error);
      throw error;
    }
  } else {
    console.log(`✅ Database "${DB_NAME}" already exists`);
  }

  // Update wrangler.json
  console.log("📝 Updating wrangler configuration...");
  const wranglerConfigPath = resolve("wrangler.json");
  const wranglerConfig = JSON.parse(readFileSync(wranglerConfigPath, "utf-8"));
  wranglerConfig.d1_databases[0].database_id = dbId;
  writeFileSync(wranglerConfigPath, JSON.stringify(wranglerConfig, null, 2));
  console.log("✅ Wrangler configuration updated");
};

const migrateDatabase = () => {
  console.log("📝 Migrating remote database...");
  execSync("pnpm run db:migrate-remote");
  console.log("✅ Database migration completed successfully");
};

const deployPages = () => {
  console.log("🚧 Deploying to Cloudflare Pages...");
  execSync("pnpm run deploy:pages");
  console.log("✅ Deployment completed successfully");
};

const main = async () => {
  try {
    validateEnvironment();
    setupWranglerConfig();
    checkAndCreateDatabase();
    migrateDatabase();
    await checkProjectExists();
    pushPagesSecret();
    deployPages();

    console.log("🎉 Deployed successfully");
  } catch (error) {
    console.error("❌ Failed to deploy", error);
    process.exit(1);
  }
};

main();
