import { NotFoundError } from "cloudflare";
import "dotenv/config";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createBucket,
  createDatabase,
  createPages,
  getBucket,
  getDatabase,
  getPages,
} from "./cloudflare";

const PROJECT_NAME = process.env.PROJECT_NAME || "image-dad";
const PROJECT_URL = process.env.NEXT_PUBLIC_APP_URL;
const DB_NAME = process.env.DATABASE_NAME || "image-dad";
const BUCKET_NAME = process.env.BUCKET_NAME || "image-dad";

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

const checkAndCreateDatabase = async () => {
  console.log(`🔍 Checking if database "${DB_NAME}" exists...`);
  let dbId;

  try {
    const database = await getDatabase();
    dbId = database.uuid;

    console.log(`✅ Database "${DB_NAME}" already exists`);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log(`⚠️ Database not found, creating new database...`);
      const database = await createDatabase();
      dbId = database.uuid;
    } else {
      console.error(
        "❌ An error occurred while checking or creating the database:",
        error
      );
      throw error;
    }
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

const checkAndCreateBucket = async () => {
  console.log(`🔍 Checking if bucket "${BUCKET_NAME}" exists...`);

  try {
    await getBucket();
    console.log(`✅ Bucket "${BUCKET_NAME}" already exists`);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log(`⚠️ Bucket not found, creating new bucket...`);
      await createBucket();
    } else {
      console.error(
        "❌ An error occurred while checking or creating the bucket:",
        error
      );
      throw error;
    }
  }
};

const checkAndCreatePages = async () => {
  console.log(`🔍 Checking if project "${PROJECT_NAME}" exists...`);

  try {
    await getPages();

    console.log("✅ Project already exists, proceeding with update...");
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log("⚠️ Project not found, creating new project...");
      const pages = await createPages();

      if (!PROJECT_URL) {
        console.log(
          "⚠️ NEXT_PUBLIC_APP_URL is empty, use pages default domain..."
        );
        console.log("📝 Updating environment variables...");
        const envFilePath = resolve(".env");
        let envConfig = readFileSync(envFilePath, "utf-8");
        envConfig = envConfig.replace(
          /^NEXT_PUBLIC_APP_URL=.*$/m,
          `NEXT_PUBLIC_APP_URL=https://${pages.subdomain}`
        );
        writeFileSync(envFilePath, envConfig);
        console.log("✅ Wrangler environment variables");
      }
    } else {
      console.error(
        "❌ An error occurred while checking or creating the project:",
        error
      );
      throw error;
    }
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

const deployPages = () => {
  console.log("🚧 Deploying to Cloudflare Pages...");
  execSync("pnpm run deploy:pages");
  console.log("✅ Deployment completed successfully");
};

const main = async () => {
  try {
    validateEnvironment();
    setupWranglerConfig();
    await checkAndCreateDatabase();
    migrateDatabase();
    await checkAndCreateBucket();
    await checkAndCreatePages();
    pushPagesSecret();
    deployPages();

    console.log("🎉 Deployed successfully");
  } catch (error) {
    console.error("❌ Failed to deploy", error);
    process.exit(1);
  }
};

main();
