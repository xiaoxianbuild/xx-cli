import { Command } from "commander";
import { Version } from "../constants";

export function createVersionCommand() {
  return new Command("version")
    .description("version of the CLI")
    .action(() => {
      console.log(`Version: ${Version}`);
      console.log(`BunVersion: ${process.version}`);
      // In Go version, there were BuildTime, Commit, GoVersion.
      // We can add placeholders or use Bun's build metadata if available.
      console.log(`Platform: ${process.platform} ${process.arch}`);
    });
}
