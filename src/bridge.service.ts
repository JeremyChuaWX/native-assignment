import {
    CrossChainMessenger,
    DEFAULT_L2_CONTRACT_ADDRESSES,
    MessageStatus,
} from "@mantleio/sdk";
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

    async depositETH(payload: { privateKey: string; amount: string }) {
        const l1Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l1RpcProvider,
        );
        const l2Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l2RpcProvider,
        );
        const l2Address = await l2Wallet.getAddress();

        console.log("Deposit ETH");
        const response = await this.messenger.depositETH(payload.amount, {
            recipient: l2Address,
            signer: l1Wallet,
        });

        console.log(`Transaction hash (on L1): ${response.hash}`);
        const receipt = await response.wait();

        /*
        // BUG: waitForMessageStatus searches from genesis block to latest, rate limited by RPC

        console.log("Waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.RELAYED,
        );
        */

        return receipt;
    }

    async withdrawETH(payload: { privateKey: string; amount: string }) {
        const l1Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l1RpcProvider,
        );
        const l2Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l2RpcProvider,
        );
        const l1Address = await l1Wallet.getAddress();

        const approve = await this.messenger.approveERC20(
            ethers.constants.AddressZero,
            DEFAULT_L2_CONTRACT_ADDRESSES.BVM_ETH,
            payload.amount,
            { signer: l2Wallet },
        );
        console.log(`Approve transaction hash (on L2): ${approve.hash}`);
        const response = await this.messenger.withdrawERC20(
            ethers.constants.AddressZero,
            DEFAULT_L2_CONTRACT_ADDRESSES.BVM_ETH,
            payload.amount,
            {
                recipient: l1Address,
                signer: l2Wallet,
            },
        );
        console.log(`Transaction hash (on L2): ${response.hash}`);
        await response.wait();
        console.log("Waiting for status to be READY_TO_PROVE");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_TO_PROVE,
        );
        await this.messenger.proveMessage(response.hash);

        console.log("Waiting for status to change to IN_CHALLENGE_PERIOD");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.IN_CHALLENGE_PERIOD,
        );

        console.log(
            "In the challenge period, waiting for status READY_FOR_RELAY",
        );
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_FOR_RELAY,
        );
        console.log("Ready for relay, finalizing message now");
        await this.messenger.finalizeMessage(response.hash);

        console.log("Waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );
    }

    async depositERC20(payload: {
        privateKey: string;
        l1TokenAddress: string;
        l2TokenAddress: string;
        amount: string;
    }) {
        const l1Wallet = new ethers.Wallet(
            payload.privateKey,
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
                recipient: payload.privateKey,
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
        privateKey: string;
        l1TokenAddress: string;
        l2TokenAddress: string;
        amount: string;
    }) {
        const l2Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l2RpcProvider,
        );
        const response = await this.messenger.withdrawERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                recipient: payload.privateKey,
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
