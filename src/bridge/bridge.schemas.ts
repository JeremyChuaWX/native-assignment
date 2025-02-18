import { z } from "zod";

export const depositETHSchema = z.object({
    privateKey: z.string(),
    amount: z.string(),
});

export const withdrawETHSchema = z.object({
    privateKey: z.string(),
    amount: z.string(),
});

export const getETHBalanceSchema = z.object({
    l1Address: z.string().optional(),
    l2Address: z.string().optional(),
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

export const getERC20BalanceSchema = z.object({
    chain: z.enum(["L1", "L2"]),
    tokenAddress: z.string(),
    address: z.string(),
});
