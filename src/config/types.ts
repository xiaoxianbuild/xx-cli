import { z } from 'zod';

export const ConfigSchema = z.object({
  version: z.string().default('0.0.1'),
});

export type Config = z.infer<typeof ConfigSchema>;
