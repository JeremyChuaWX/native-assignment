import type { Provider } from "@nestjs/common";
import { z } from "zod";

const envSchema = z.object({
    SERVER_PORT: z.coerce.number(),
    L1_RPC: z.string(),
    L2_RPC: z.string(),
    L1_CHAIN_ID: z.string(),
    L2_CHAIN_ID: z.string(),
    L1_RPC_PROVIDER: z.string(),
    L2_RPC_PROVIDER: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV_PROVIDER = Symbol.for("ENV_PROVIDER");

export const envProvider: Provider<Env> = {
    provide: ENV_PROVIDER,
    useFactory: () => envSchema.parse(process.env),
};
