import { Command } from 'commander';
import { CommandName, CommandShortDesc, Version } from './constants';
import { createInitCommand } from './commands/init';
import { createPrintCommand } from './commands/print';
import { createDoctorCommand } from './commands/doctor';
import { createVersionCommand } from './commands/version';
import { createUpdateCommand } from './commands/update';
import { createUpgradeCommand } from './commands/upgrade';
import { createInstallCommand } from './commands/install';
import { createUninstallCommand } from './commands/uninstall';
import { createListCommand } from './commands/list';
import { createInfoCommand } from './commands/info';

const program = new Command();

program.name(CommandName).description(CommandShortDesc).version(Version, '-v, --version');

program.addCommand(createInitCommand());
program.addCommand(createPrintCommand());
program.addCommand(createDoctorCommand());
program.addCommand(createVersionCommand());
program.addCommand(createUpdateCommand());
program.addCommand(createUpgradeCommand());
program.addCommand(createInstallCommand());
program.addCommand(createUninstallCommand());
program.addCommand(createListCommand());
program.addCommand(createInfoCommand());

program.parse();
