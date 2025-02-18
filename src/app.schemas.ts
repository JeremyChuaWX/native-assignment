import { z } from "zod";

export const depositETHSchema = z.object({
    privateKey: z.string(),
    amount: z.string(),
});

export const withdrawETHSchema = z.object({
    privateKey: z.string(),
    amount: z.string(),
});

export const depositERC20Schema = z.object({
    privateKey: z.string(),
    l1TokenAddress: z.string(),
    l2TokenAddress: z.string(),
    amount: z.string(),
});

export const withdrawERC20Schema = z.object({
    privateKey: z.string(),
    l1TokenAddress: z.string(),
    l2TokenAddress: z.string(),
    amount: z.string(),
});
