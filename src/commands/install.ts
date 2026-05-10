import { Command } from "commander";
import { install, upgrade } from "../tools/package_manager/manager";

export function createInstallCommand() {
  return new Command("install")
    .alias("add")
    .description("install packages")
    .argument("<package>", "package to install")
    .option("-u, --upgrade", "upgrade packages")
    .action(async (packageName, options) => {
      try {
        if (options.upgrade) {
          await upgrade(packageName);
        } else {
          await install(packageName);
        }
      } catch (error) {
        console.error("Install failed:", (error as Error).message);
        process.exit(1);
      }
    });
}
