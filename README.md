# Rebalancing Funds Problem Statement

One of the unique challenges in DeFi trading is to move funds across different
blockchains quickly.
Build a tool to allow the trading strategy to programmatically move funds
between Ethereum mainnet and Mantle chain.
It should handle as many edge cases as possible and ensure that the funds arrive
at the destination correctly.

## Notes

- questions
  - how will users use the tool (browser, command line, HTTP REST API)?
  - will it be deployed per user, or as a centralised service?
    - self-deployed
      - keys are self-managed
    - centralised
      - key management and authentication
  - what type of funds will be moved?
    - network tokens?
    - smart contract tokens?
- architecture
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
  - <https://github.com/ethereum/go-ethereum>
  - <https://docs.mantle.xyz/network>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-eth/index.js>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-mnt/index.js>
