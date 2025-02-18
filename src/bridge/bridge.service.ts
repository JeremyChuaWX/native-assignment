import {
    CrossChainMessenger,
    DEFAULT_L2_CONTRACT_ADDRESSES,
    MessageStatus,
} from "@mantleio/sdk";
import { Inject, Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import type { Config } from "src/config/config.provider";
import { CONFIG_PROVIDER } from "src/config/config.provider";
import { ERC20ABI } from "./bridge.constants";

@Injectable()
export class BridgeService {
    private l1RpcProvider: ethers.providers.JsonRpcProvider;
    private l2RpcProvider: ethers.providers.JsonRpcProvider;
    private messenger: CrossChainMessenger;

    constructor(@Inject(CONFIG_PROVIDER) private readonly config: Config) {
        this.l1RpcProvider = new ethers.providers.JsonRpcProvider(
            this.config.L1_RPC,
        );
        this.l2RpcProvider = new ethers.providers.JsonRpcProvider(
            this.config.L2_RPC,
        );
        this.messenger = new CrossChainMessenger({
            l1ChainId: this.config.L1_CHAIN_ID,
            l2ChainId: this.config.L2_CHAIN_ID,
            l1SignerOrProvider: this.l1RpcProvider,
            l2SignerOrProvider: this.l2RpcProvider,
            bedrock: true,
        });
    }

    async depositETH(payload: { privateKey: string; amount: string }) {
        console.log("deposit ETH");

        const l1Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l1RpcProvider,
        );
        const l2Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l2RpcProvider,
        );
        const l2Address = await l2Wallet.getAddress();

        const response = await this.messenger.depositETH(payload.amount, {
            recipient: l2Address,
            signer: l1Wallet,
        });

        console.log(`transaction hash (on L1): ${response.hash}`);
        const receipt = await response.wait();

        console.log("Waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );

        return receipt;
    }

    async withdrawETH(payload: { privateKey: string; amount: string }) {
        console.log("withdraw ETH");

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
        await approve.wait();
        console.log(`approve transaction hash (on L2): ${approve.hash}`);

        const response = await this.messenger.withdrawERC20(
            ethers.constants.AddressZero,
            DEFAULT_L2_CONTRACT_ADDRESSES.BVM_ETH,
            payload.amount,
            {
                recipient: l1Address,
                signer: l2Wallet,
            },
        );
        console.log(`transaction hash (on L2): ${response.hash}`);

        const receipt = await response.wait();

        console.log("waiting for status to be READY_TO_PROVE");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_TO_PROVE,
        );

        console.log("proving transaction");
        await this.messenger.proveMessage(response.hash);

        console.log("waiting for status to change to IN_CHALLENGE_PERIOD");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.IN_CHALLENGE_PERIOD,
        );

        console.log(
            "in the challenge period, waiting for status READY_FOR_RELAY",
        );
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_FOR_RELAY,
        );

        console.log("ready for relay, finalizing message now");
        await this.messenger.finalizeMessage(response.hash);

        console.log("waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );

        return receipt;
    }

    async depositERC20(payload: {
        privateKey: string;
        l1TokenAddress: string;
        l2TokenAddress: string;
        amount: string;
    }) {
        console.log("deposit ERC20");

        const l1Wallet = new ethers.Wallet(
            payload.privateKey,
            this.l1RpcProvider,
        );

        const approve = await this.messenger.approveERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                signer: l1Wallet,
            },
        );
        await approve.wait();
        console.log(`approve transaction hash (on L1): ${approve.hash}`);

        const response = await this.messenger.depositERC20(
            payload.l1TokenAddress,
            payload.l2TokenAddress,
            payload.amount,
            {
                recipient: payload.privateKey,
                signer: l1Wallet,
            },
        );
        console.log(`deposit transaction hash (on L1): ${response.hash}`);

        const receipt = await response.wait();

        console.log("waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.RELAYED,
        );

        return receipt;
    }

    async withdrawERC20(payload: {
        privateKey: string;
        l1TokenAddress: string;
        l2TokenAddress: string;
        amount: string;
    }) {
        console.log("withdraw ERC20");

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
        console.log(`transaction hash (on L2): ${response.hash}`);

        const receipt = await response.wait();

        console.log("waiting for status to be READY_TO_PROVE");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_TO_PROVE,
        );

        console.log("proving transaction");
        await this.messenger.proveMessage(response.hash);

        console.log("waiting for status to be IN_CHALLENGE_PERIOD");
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.IN_CHALLENGE_PERIOD,
        );

        console.log(
            "in the challenge period, waiting for status READY_FOR_RELAY",
        );
        await this.messenger.waitForMessageStatus(
            response.hash,
            MessageStatus.READY_FOR_RELAY,
        );

        console.log("ready for relay, finalizing message now");
        await this.messenger.finalizeMessage(response.hash);

        console.log("waiting for status to change to RELAYED");
        await this.messenger.waitForMessageStatus(
            response,
            MessageStatus.RELAYED,
        );

        return receipt;
    }

    async getL1ETHBalance(payload: { walletAddress: string }) {
        return await this.l1RpcProvider.getBalance(payload.walletAddress);
    }

    async getL2ETHBalance(payload: { walletAddress: string }) {
        const contract = new ethers.Contract(
            DEFAULT_L2_CONTRACT_ADDRESSES.BVM_ETH as string,
            ERC20ABI,
            this.l2RpcProvider,
        );
        return await contract.balanceOf(payload.walletAddress);
    }

    async getERC20Balance(payload: {
        chain: "L1" | "L2";
        tokenAddress: string;
        Address: string;
    }) {
        const provider: ethers.providers.JsonRpcProvider =
            payload.chain === "L1" ? this.l1RpcProvider : this.l2RpcProvider;
        const contract = new ethers.Contract(
            payload.tokenAddress,
            ERC20ABI,
            provider,
        );
        return await contract.balanceOf(payload.tokenAddress);
    }
}
