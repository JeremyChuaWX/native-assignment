import { z } from "zod";

export const bridgePayloadSchema = z.object({
    key: z.string(),
    amount: z.string(),
});

export type BridgePayload = z.infer<typeof bridgePayloadSchema>;
