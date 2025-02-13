# Rebalancing Funds Problem Statement

One of the unique challenges in DeFi trading is to move funds (ERC20, ETH)
across different blockchains quickly.
Build a tool to allow the trading strategy to programmatically move funds
between Ethereum mainnet and Mantle chain.
It should handle as many edge cases as possible and ensure that the funds arrive
at the destination correctly.

## Notes

- architecture (microservice)
  - storage
    - sqlite
    - append-optimised storage
  - auth
    - pub/priv keys
  - caching
    - cache balances?
  - batching
  - queues
  - logging
- flow
  - register wallets
  - endpoints
    - batch/single
    - sync/async
- testing
  - testnet/localnet setup
- resources
  - <https://docs.mantle.xyz/network>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-eth/index.js>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-mnt/index.js>
  - <https://sdk.mantle.xyz/>
