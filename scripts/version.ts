import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
type VersionType = "major" | "minor" | "patch";

interface PackageJson {
  version: string;
  [key: string]: unknown;
}

// Get the version type from command line arguments
const versionType = (process.argv[2] ?? "patch") as VersionType;

// Valid version types
const validTypes: VersionType[] = ["major", "minor", "patch"];

if (!validTypes.includes(versionType)) {
  console.error(
    `Error: Invalid version type "${versionType}". Must be one of: ${validTypes.join(", ")}`,
  );
  process.exit(1);
}

// Read package.json
const packageJsonPath = path.join(__dirname, "../package.json");

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent) as PackageJson;
  const currentVersion: string = packageJson.version;

  console.log(`Current version: ${currentVersion}`);

  // Parse the current version
  const versionParts: number[] = currentVersion.split(".").map(Number);

  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    console.error(
      "Error: Invalid version format in package.json. Expected format: x.y.z",
    );
    process.exit(1);
  }

  let [major, minor, patch] = versionParts;

  major = major ?? 0;
  minor = minor ?? 0;
  patch = patch ?? 0;

  // Increment based on type
  switch (versionType) {
    case "major":
      major++;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor++;
      patch = 0;
      break;
    case "patch":
      patch++;
      break;
  }

  const newVersion = `${major}.${minor}.${patch}`;

  // Update package.json
  packageJson.version = newVersion;

  // Write back to package.json with proper formatting
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  console.log(`✅ Version updated: ${currentVersion} → ${newVersion}`);
} catch (error) {
  console.error("Error updating version:", (error as Error).message);
  process.exit(1);
}
