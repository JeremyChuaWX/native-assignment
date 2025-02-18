# Rebalancing Funds Problem Statement

One of the unique challenges in DeFi trading is to move funds (ERC20, ETH)
across different blockchains quickly.
Build a tool to allow the trading strategy to programmatically move funds
between Ethereum mainnet and Mantle chain.
It should handle as many edge cases as possible and ensure that the funds arrive
at the destination correctly.

## Usage

- Start server

  ```bash
  docker compose --file compose.dev.yaml up --build
  ```

- Stop server

  ```bash
  docker compose --file compose.dev.yaml down --remove-orphans --volumes
  ```

## Notes

- edge cases
  - token does not implement ERC20 properly
- architecture (microservice)
  - auth
    - pub/priv keys
  - caching
    - redis
    - cache balances?
  - batching
  - queues
- resources
  - <https://docs.mantle.xyz/network>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-eth/index.js>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-mnt/index.js>
  - <https://github.com/mantlenetworkio/mantle-v2/tree/develop/ops>
  - <https://sdk.mantle.xyz/>
- bugs
  - mantle SDK queries from genesis to latest block, rate limiting on RPC for
    querying ETH logs, cannot await transaction statuses, need to handroll
    requests to RPC
