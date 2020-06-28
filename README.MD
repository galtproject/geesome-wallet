# DCity market

API for working with shops and orders to get payments and withdraw it.

## How to run

1. Install [nvm and node v10.15.3](https://github.com/creationix/nvm)
2. Install mysql database software and configure it for non-default values(local server and root/root access) at `./database/mysql/` folder
3. `npm i`
4. `npm start`

## Environment variables

| Variable | Description |
|-----|-------------|
| DATABASE_NAME | Specify database name for store |
| API_PORT | Specify port of application api  |
| RPC_WS_SERVER | Specify address of rpc server  |

## Use pm2 example for working in background
```
pm2 install typescript
DATABASE_NAME=dcity_market API_PORT=3344 RPC_WS_SERVER=ws://localhost:8646 pm2 start ./index.ts --name "dcity-market"
pm2 save
pm2 startup
```

## API

| URL | Header | Body | Response |
| --- | --- | --- | --- |
| /v1/register-provider | None | None | {password: string} |
| /v1/init-order | Authorization: Bearer password | {shopId: string, orderId: string} | {address: string} |
| /v1/get-order-payment | Authorization: Bearer password | {shopId: string, orderId: string} | {currentBalance: number, totalPaid: number} |
| /v1/get-shop-balance | Authorization: Bearer password | {shopId: string} | {currentBalance: number} |
| /v1/transfer-from-shop | Authorization: Bearer password | {shopId: string, toAddress: string, amount: number} | {txId: string} |
| /v1/get-provider-shops | Authorization: Bearer password | None | [shopId: string] |

##  Tests
```
npm test
```

### Tests coverage
```
npm run testCoverage
```

