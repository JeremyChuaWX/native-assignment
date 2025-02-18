# Rebalancing Funds Problem Statement

One of the unique challenges in DeFi trading is to move funds (ERC20, ETH)
across different blockchains quickly.
Build a tool to allow the trading strategy to programmatically move funds
between Ethereum mainnet and Mantle chain.
It should handle as many edge cases as possible and ensure that the funds arrive
at the destination correctly.

## Usage

### Configuration

- Copy the `.env.example` and rename to `.env`
- Fill in the values for the variables in `.env`

### Development

- Install packages

  ```bash
  npm install
  ```

- Run the server

  ```bash
  npm run start
  ```

### Docker

- Start server

  ```bash
  docker compose --file compose.dev.yaml up --build
  ```

- Stop server

  ```bash
  docker compose --file compose.dev.yaml down --remove-orphans --volumes
  ```

## Endpoints

```json
{
  "/api/bridge/": {
    "/eth": {
      "/deposit": {
        "method": "post",
        "description": "deposits ETH from L1 to L2 for a given address",
        "payload": {
          "privateKey": "wallet to operate on",
          "amount": "amount to deposit in wei"
        }
      },
      "/withdraw": {
        "method": "post",
        "description": "withdraws ETH from L2 to L1 for a given address",
        "payload": {
          "privateKey": "wallet to operate on",
          "amount": "amount to withdraw in wei"
        }
      },
      "/balance": {
        "method": "post",
        "description": "get the balance of ETH (wETH for L2) for given addresses",
        "payload": {
          "l1Address": "L1 address to get balance of (optional)",
          "l2Address": "L2 address to get balance of (optional)"
        }
      }
    },
    "/erc20": {
      "/deposit": {
        "method": "post",
        "description": "deposits ERC20 token from L1 to L2 for a given address",
        "payload": {
          "privateKey": "wallet to operate on",
          "l1TokenAddress": "L1 address for the token",
          "l2TokenAddress": "L2 address for the token",
          "amount": "amount to deposit in wei"
        }
      },
      "/withdraw": {
        "method": "post",
        "description": "withdraws ERC20 token from L2 to L1 for a given address",
        "payload": {
          "privateKey": "wallet to operate on",
          "l1TokenAddress": "L1 address for the token",
          "l2TokenAddress": "L2 address for the token",
          "amount": "amount to withdraw in wei"
        }
      },
      "/balance": {
        "method": "post",
        "description": "get the balance of ETH (wETH for L2) for given addresses",
        "payload": {
          "chain": "enum of values 'L1' or 'L2'"
          "tokenAddress": "address for the token",
          "address": "address to get balance of"
        }
      }
    }
  }
}
```

## Notes

> Notes on potential fixes and implementations

- querying transaction statuses
  - when querying for transaction statuses, the mantle SDK queries from genesis
    to latest block
  - rate limiting on public RPCs for querying ETH logs cause the status checks
    to fail
  - this makes difficult to track, and in the case of withdrawal transactions,
    unable to complete as we need to prove and finalise transactions only after
    specific statuses
  - the current implementation follows the instructions as demonstrated in the
    mantle docs, but fixes are required for full functinality
  - potential fix is to handroll status check requests to the RPC, providing a
    smaller range of blocks to query, avoiding the rate limiting issue block
    range
- implement job queue for asynchronous operation
  - waiting for statuses can take very long, (7 days in challenge period for
    mainnet mantle)
  - implement job queue to manage deposit and withdrawal requests asynchronously
  - subscribe to bridge contract events to update request statuses

## Resources

- <https://docs.mantle.xyz/network>
- <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-eth/index.js>
- <https://github.com/mantlenetworkio/mantle-tutorial/blob/main/cross-dom-bridge-mnt/index.js>
- <https://github.com/mantlenetworkio/mantle-v2/tree/develop/ops>
- <https://sdk.mantle.xyz/>
