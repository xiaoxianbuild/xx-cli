import { Command } from 'commander';
import { search } from '../tools/package-manager/manager';

export function createSearchCommand() {
  return new Command('search')
    .alias('s')
    .description('search for packages')
    .argument('<query>', 'package name query')
    .action(async (query: string) => {
      try {
        const results = await search(query);
        for (const result of results) {
          if (result.packages.length > 0) {
            console.log(`\n--- ${result.manager} ---`);

            // Group by type
            const groups: Record<string, typeof result.packages> = {};
            for (const pkg of result.packages) {
              const type = pkg.type || 'Other';
              if (!groups[type]) groups[type] = [];
              groups[type].push(pkg);
            }

            for (const [type, pkgs] of Object.entries(groups)) {
              if (Object.keys(groups).length > 1 || type !== 'Other') {
                console.log(`\n[${type}]`);
              }
              for (const pkg of pkgs) {
                const installedMark = pkg.isInstalled ? ' \x1b[32m✔\x1b[0m' : '';
                const tagsStr = pkg.tags ? ` \x1b[90m(${pkg.tags.join(', ')})\x1b[0m` : '';
                const versionStr = pkg.version ? ` \x1b[33m${pkg.version}\x1b[0m` : '';
                const descStr = pkg.description ? ` - ${pkg.description}` : '';
                console.log(`  ${pkg.name}${versionStr}${installedMark}${tagsStr}${descStr}`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Search failed:', (error as Error).message);
        process.exit(1);
      }
    });
}
