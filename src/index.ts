import { Command } from "commander";
import { CommandName, CommandShortDesc, Version } from "./constants";
import { createInitCommand } from "./commands/init";
import { createPrintCommand } from "./commands/print";
import { createDoctorCommand } from "./commands/doctor";
import { createVersionCommand } from "./commands/version";

const program = new Command();

program
  .name(CommandName)
  .description(CommandShortDesc)
  .version(Version);

program.addCommand(createInitCommand());
program.addCommand(createPrintCommand());
program.addCommand(createDoctorCommand());
program.addCommand(createVersionCommand());

program.parse();
