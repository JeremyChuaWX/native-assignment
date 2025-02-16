import { CrossChainMessenger, MessageStatus } from "@mantleio/sdk";
import { Inject, Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import type { Env } from "./env.provider";
import { ENV_PROVIDER } from "./env.provider";

@Injectable()
export class BridgeService {
    private l1RpcProvider: ethers.providers.JsonRpcProvider;
    private l2RpcProvider: ethers.providers.JsonRpcProvider;
    private messenger: CrossChainMessenger;

    constructor(@Inject(ENV_PROVIDER) private readonly env: Env) {
        this.l1RpcProvider = new ethers.providers.JsonRpcProvider(
            this.env.L1_RPC,
        );
        this.l2RpcProvider = new ethers.providers.JsonRpcProvider(
            this.env.L2_RPC,
        );
        this.messenger = new CrossChainMessenger({
            l1ChainId: this.env.L1_CHAIN_ID,
            l2ChainId: this.env.L2_CHAIN_ID,
            l1SignerOrProvider: this.l1RpcProvider,
            l2SignerOrProvider: this.l2RpcProvider,
            bedrock: true,
        });
    }

    async depositETH(payload: {
        l1PrivateKey: string;
        l2PublicKey: string;
        amount: string;
    }) {
        const l1Wallet = new ethers.Wallet(
            payload.l1PrivateKey,
            this.l1RpcProvider,
        );
        const response = await this.messenger.depositETH(payload.amount, {
            recipient: payload.l2PublicKey,
            signer: l1Wallet,
        });
        await response.wait();
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );
    }

    async withdrawETH(payload: {
        l1PublicKey: string;
        l2PrivateKey: string;
        amount: string;
    }) {
        const l2Wallet = new ethers.Wallet(
            payload.l2PrivateKey,
            this.l2RpcProvider,
        );
        const response = await this.messenger.withdrawETH(payload.amount, {
            recipient: payload.l1PublicKey,
            signer: l2Wallet,
        });
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

    async depositERC20(payload: {
        l1TokenAddress: string;
        l1PrivateKey: string;
        l2TokenAddress: string;
        l2PublicKey: string;
        amount: string;
    }) {
        const l1Wallet = new ethers.Wallet(
            payload.l1PrivateKey,
            this.l1RpcProvider,
        );
        const allowanceResponse = await this.messenger.approveERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                signer: l1Wallet,
            },
        );
        await allowanceResponse.wait();
        const response = await this.messenger.depositERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                recipient: payload.l2PublicKey,
                signer: l1Wallet,
            },
        );
        await response.wait();
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.RELAYED,
        );
    }

    async withdrawERC20(payload: {
        l1TokenAddress: string;
        l1PublicKey: string;
        l2TokenAddress: string;
        l2PrivateKey: string;
        amount: string;
    }) {
        const l2Wallet = new ethers.Wallet(
            payload.l2PrivateKey,
            this.l2RpcProvider,
        );
        const response = await this.messenger.withdrawERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                recipient: payload.l1PublicKey,
                signer: l2Wallet,
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
