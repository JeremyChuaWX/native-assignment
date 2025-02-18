/**
 * @description To be used to instantiate an instance of ERC20 tokens to get balance
 */
export const ERC20ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];
