import type { Provider } from "@nestjs/common";
import { z } from "zod";

const configSchema = z.object({
    SERVER_PORT: z.coerce.number(),
    SERVER_API_KEY: z.string(),
    L1_CHAIN_ID: z.coerce.number(),
    L1_RPC: z.string(),
    L2_CHAIN_ID: z.coerce.number(),
    L2_RPC: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const CONFIG_PROVIDER = Symbol.for("ENV_PROVIDER");

export const ConfigProvider: Provider<Config> = {
    provide: CONFIG_PROVIDER,
    useFactory: () => configSchema.parse(process.env),
};
