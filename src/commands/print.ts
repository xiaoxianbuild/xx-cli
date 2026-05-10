import { Command } from "commander";

export function createPrintCommand() {
  const printCommand = new Command("print")
    .description("print something")
    .option("-r, --raw", "raw print")
    .option("-n, --with-name", "print with name")
    .option("-m, --multi", "print with multi variables")
    .argument("<vars...>", "variables to print")
    .action((vars, options) => {
      if (!options.multi && vars.length > 1) {
        console.error("print command does not accept multiple arguments without --multi flag");
        process.exit(1);
      }

      for (const name of vars) {
        if (options.withName) {
          console.log(`[${name}]`);
        }
        const value = process.env[name] || "";
        if (options.raw) {
          console.log(value);
        } else {
          // In Go it used EnvironmentSeparator which is ':'
          // system_utils.GetEnvPrintString splits by separator and joins with newline
          console.log(value.split(":").join("\n"));
        }
      }
    });

  const envCommand = new Command("env")
    .description("print env variable")
    .option("-r, --raw", "raw print")
    .option("-n, --with-name", "print with name")
    .option("-m, --multi", "print with multi variables")
    .argument("<vars...>", "variables to print")
    .action((vars, options) => {
      // Reuse the same logic
      printCommand.action()(vars, options);
    });

  printCommand.addCommand(envCommand);

  return printCommand;
}
