import type { Provider } from "@nestjs/common";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV_PROVIDER = Symbol.for("ENV_PROVIDER");

export const envProvider: Provider<Env> = {
    provide: ENV_PROVIDER,
    useFactory: () => envSchema.parse(process.env),
};
