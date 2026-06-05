import { z } from 'zod';

export const BrewPackage = {
  wget: 'wget',
} as const;

export type BrewPackage = (typeof BrewPackage)[keyof typeof BrewPackage];

/** 提取所有值为元组，供 z.enum() 和默认值使用 */
const BrewPackageValues = Object.values(BrewPackage) as [BrewPackage, ...BrewPackage[]];

export const ConfigSchema = z.object({
  version: z.string().default('0.0.1'),
  packages: z
    .object({
      brew: z.array(z.enum(BrewPackageValues)),
    })
    .default({ brew: [...BrewPackageValues] }),
});

export type Config = z.infer<typeof ConfigSchema>;
