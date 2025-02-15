import { CrossChainMessenger, MessageStatus } from "@mantleio/sdk";
import { Inject, Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import type { Env } from "./env.provider";
import { ENV_PROVIDER } from "./env.provider";
import type { BridgePayload } from "./validation";

@Injectable()
export class BridgeService {
    private l1RpcProvider: ethers.providers.JsonRpcProvider;
    private l2RpcProvider: ethers.providers.JsonRpcProvider;
    private messenger: CrossChainMessenger;

    constructor(@Inject(ENV_PROVIDER) env: Env) {
        this.l1RpcProvider = new ethers.providers.JsonRpcProvider(env.L1_RPC);
        this.l2RpcProvider = new ethers.providers.JsonRpcProvider(env.L2_RPC);
        this.messenger = new CrossChainMessenger({
            l1ChainId: env.L1_CHAIN_ID,
            l2ChainId: env.L2_CHAIN_ID,
            l1SignerOrProvider: env.L1_RPC_PROVIDER,
            l2SignerOrProvider: env.L2_RPC_PROVIDER,
            bedrock: true,
        });
    }

    async depositETH(payload: BridgePayload) {
        const l1Wallet = new ethers.Wallet(payload.key, this.l1RpcProvider);
        const response = await this.messenger.depositETH(payload.amount, {
            signer: l1Wallet,
        });
        await response.wait();
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );
    }

    async withdraw(payload: BridgePayload) {
        const l1Wallet = new ethers.Wallet(payload.key, this.l1RpcProvider);
        const l2Wallet = new ethers.Wallet(payload.key, this.l2RpcProvider);
        await this.messenger.approveERC20(
            ethers.constants.AddressZero,
            l2ETH,
            payload.amount,
            {
                signer: l2Wallet,
                overrides: {
                    gasLimit: 300_000,
                },
            },
        );
        const response = await this.messenger.withdrawERC20(
            ethers.constants.AddressZero,
            l2ETH,
            payload.amount,
            {
                recipient: l1Wallet.address,
                signer: l2Wallet,
                overrides: {
                    gasLimit: 300_000,
                },
            },
        );
        await response.wait();
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_TO_PROVE,
        );
        await this.messenger.proveMessage(response.hash);
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.IN_CHALLENGE_PERIOD,
        );
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_FOR_RELAY,
        );
        await this.messenger.finalizeMessage(response.hash);
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );
    }
}
