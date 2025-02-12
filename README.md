# Rebalancing Funds Problem Statement

One of the unique challenges in DeFi trading is to move funds across different
blockchains quickly.
Build a tool to allow the trading strategy to programmatically move funds
between Ethereum mainnet and Mantle chain.
It should handle as many edge cases as possible and ensure that the funds arrive
at the destination correctly.

You are free to the following programming languages, with the following
limitations:

1. Typescript
2. Python (type hints coverage must be > 90%)
3. Golang
4. Rust
5. Java The tool must be containerized and deployable via docker.

Kindly share your repo within 1 week of receiving this assignment.

## Notes

- questions
  - how will users use the tool (browser, command line, HTTP REST API)?
  - will it be deployed per use, or as a centralised service?
    - self-deployed
      - keys are self-managed
    - centralised
      - key management and authentication
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
- resources
  - <https://github.com/ethereum/go-ethereum>
  - <https://docs.mantle.xyz/network>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-eth/index.js>
  - <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-mnt/index.js>
