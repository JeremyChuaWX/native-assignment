import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UsePipes,
} from "@nestjs/common";
import { Validate } from "src/validation/validation.pipe";
import { z } from "zod";
import {
    depositERC20Schema,
    depositETHSchema,
    getERC20BalanceSchema,
    getETHBalanceSchema,
    withdrawERC20Schema,
    withdrawETHSchema,
} from "./bridge.schemas";
import { BridgeService } from "./bridge.service";

@Controller("/bridge")
export class BridgeController {
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
        return {
            transaction: transaction.transactionHash,
        };
    }

    @Post("/eth/balance")
    @UsePipes(new Validate(getETHBalanceSchema))
    async getL1ETHBalance(@Body() body: z.infer<typeof getETHBalanceSchema>) {
        if (Object.keys(body).length === 0) {
            throw new BadRequestException("no addresses provided");
        }

        const res: { l1Balance?: string; l2Balance?: string } = {};

        if (body.l1Address !== undefined) {
            const l1Balance = await this.bridgeService.getL1ETHBalance({
                walletAddress: body.l1Address,
            });
            res.l1Balance = l1Balance.toString();
        }

        if (body.l2Address !== undefined) {
            const l2Balance = await this.bridgeService.getL2ETHBalance({
                walletAddress: body.l2Address,
            });
            res.l2Balance = l2Balance.toString();
        }

        return res;
    }

    @Post("/erc20/deposit")
    @UsePipes(new Validate(depositERC20Schema))
    async depositERC20(@Body() body: z.infer<typeof depositERC20Schema>) {
        const transaction = await this.bridgeService.depositERC20(body);
        return {
            transaction: transaction.transactionHash,
        };
    }

    @Post("/erc20/withdraw")
    @UsePipes(new Validate(withdrawERC20Schema))
    async withdrawERC20(@Body() body: z.infer<typeof withdrawERC20Schema>) {
        const transaction = await this.bridgeService.withdrawERC20(body);
        return {
            transaction: transaction.transactionHash,
        };
    }

    @Post("/erc20/balance")
    @UsePipes(new Validate(getERC20BalanceSchema))
    async getL1ERC20Balance(
        @Body() body: z.infer<typeof getERC20BalanceSchema>,
    ) {
        const balance = await this.bridgeService.getERC20Balance(body);
        return {
            balance: balance.toString(),
        };
    }
}
