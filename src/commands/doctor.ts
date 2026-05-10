import { Command } from 'commander';
import os from 'node:os';

export function createDoctorCommand() {
  return new Command('doctor').description('doctor check xiaoxian cli environment').action(() => {
    console.log('doctor called, check your computer environment');
    console.log('1. check your system:', os.platform(), os.arch());
  });
}
