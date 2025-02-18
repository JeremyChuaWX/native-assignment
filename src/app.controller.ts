import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { BridgeService } from "src/bridge.service";
import { Validate } from "src/validation.pipe";
import { z } from "zod";
import {
    depositERC20Schema,
    depositETHSchema,
    withdrawERC20Schema,
    withdrawETHSchema,
} from "./app.schemas";

@Controller()
export class AppController {
    constructor(private readonly bridgeService: BridgeService) {}

    @Post("/eth/deposit")
    @UsePipes(new Validate(depositETHSchema))
    async depositETH(@Body() body: z.infer<typeof depositETHSchema>) {
        const transaction = await this.bridgeService.depositETH(body);
        return {
            transaction: transaction.transactionHash,
        };
    }

    @Post("/eth/withdraw")
    @UsePipes(new Validate(withdrawETHSchema))
    async withdrawETH(@Body() body: z.infer<typeof withdrawETHSchema>) {
        const transaction = await this.bridgeService.withdrawETH(body);
        // return {
        //     transaction: transaction.transactionHash,
        // };
    }

    @Post("/erc20/deposit")
    @UsePipes(new Validate(depositERC20Schema))
    async depositERC20(@Body() body: z.infer<typeof depositERC20Schema>) {
        const transaction = await this.bridgeService.depositERC20(body);
        // return {
        //     transaction: transaction.transactionHash,
        // };
    }

    @Post("/erc20/withdraw")
    @UsePipes(new Validate(withdrawERC20Schema))
    async withdrawERC20(@Body() body: z.infer<typeof withdrawERC20Schema>) {
        const transaction = await this.bridgeService.withdrawERC20(body);
        // return {
        //     transaction: transaction.transactionHash,
        // };
    }
}
