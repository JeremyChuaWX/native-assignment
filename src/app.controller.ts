import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { BridgeService } from "src/bridge.service";
import { Validate } from "src/validation";
import { z } from "zod";

const depositETHSchema = z.object({
    l1PrivateKey: z.string(),
    l2PublicKey: z.string(),
    amount: z.string(),
});

const withdrawETHSchema = z.object({
    l1PublicKey: z.string(),
    l2PrivateKey: z.string(),
    amount: z.string(),
});

const depositERC20Schema = z.object({
    l1TokenAddress: z.string(),
    l1PrivateKey: z.string(),
    l2TokenAddress: z.string(),
    l2PublicKey: z.string(),
    amount: z.string(),
});

const withdrawERC20Schema = z.object({
    l1TokenAddress: z.string(),
    l1PublicKey: z.string(),
    l2TokenAddress: z.string(),
    l2PrivateKey: z.string(),
    amount: z.string(),
});

@Controller()
export class AppController {
    constructor(private readonly bridgeService: BridgeService) {}

    @Post("/eth/deposit")
    @UsePipes(new Validate(depositETHSchema))
    async depositETH(@Body() body: z.infer<typeof depositETHSchema>) {
        await this.bridgeService.depositETH(body);
    }

    @Post("/eth/withdraw")
    @UsePipes(new Validate(withdrawETHSchema))
    async withdrawETH(@Body() body: z.infer<typeof withdrawETHSchema>) {
        await this.bridgeService.withdrawETH(body);
    }

    @Post("/erc20/deposit")
    @UsePipes(new Validate(depositERC20Schema))
    async depositERC20(@Body() body: z.infer<typeof depositERC20Schema>) {
        await this.bridgeService.depositERC20(body);
    }

    @Post("/erc20/withdraw")
    @UsePipes(new Validate(withdrawERC20Schema))
    async withdrawERC20(@Body() body: z.infer<typeof withdrawERC20Schema>) {
        await this.bridgeService.withdrawERC20(body);
    }
}
