import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
};

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
) as PackageJson;

const nvmrcPath = join(process.cwd(), ".nvmrc");

describe("runtime contract", () => {
  it("pins Next.js 16 with a Node.js version that satisfies its engine requirement", () => {
    expect(existsSync(nvmrcPath)).toBe(true);

    const nodeVersion = readFileSync(nvmrcPath, "utf8").trim();

    expect(packageJson.dependencies?.next).toMatch(/^\^16\./);
    expect(packageJson.devDependencies?.["eslint-config-next"]).toMatch(/^\^16\./);
    expect(packageJson.engines?.node).toBe(">=20.9.0");
    expect(packageJson.devDependencies?.node).toBe("20.11.1");
    expect(nodeVersion).toBe("20.11.1");
  });
});
