import { z } from "zod";

export const depositETHSchema = z.object({
    l1PrivateKey: z.string(),
    l2PublicKey: z.string(),
    amount: z.string(),
});

export const withdrawETHSchema = z.object({
    l1PublicKey: z.string(),
    l2PrivateKey: z.string(),
    amount: z.string(),
});

export const depositERC20Schema = z.object({
    l1TokenAddress: z.string(),
    l1PrivateKey: z.string(),
    l2TokenAddress: z.string(),
    l2PublicKey: z.string(),
    amount: z.string(),
});

export const withdrawERC20Schema = z.object({
    l1TokenAddress: z.string(),
    l1PublicKey: z.string(),
    l2TokenAddress: z.string(),
    l2PrivateKey: z.string(),
    amount: z.string(),
});
