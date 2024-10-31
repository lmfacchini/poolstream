<h1 align="center">
  <a href="https://tronweb.network">
    <img align="center" src="https://raw.githubusercontent.com/tronprotocol/tronweb/master/assets/logo.png"/>
  </a>
</h1>

## What is PoolStream?

[PoolStream](https://poolstream.io) PoolStream unifies access to various types of cryptocurrencies and their networks through a single API. This access is designed with a straightforward structure, excluding the complexity of smart contracts. Its functionality is limited to controlling fund transfers between wallets..

## HomePage

**[poolstream.io](https://poolstream.io)**

## Compatibility

- Version built for Node.js v20.18.0 and above

You can access either version specifically from the dist folder.

PoolStream is also compatible with frontend frameworks such as:

- Angular
- React
- Vue.

## Installation

### Node.js

```bash
npm install poolstream
```

or

```bash
yarn add poolstream
```

## Production URL

To use it use the following endpoint:

```
https://api.poolstream.io
```

## API_KEY

Access: **[dashboard.poolstream.io](https://dashboard.poolstream.io)**

## Creating an Instance

First of all, in your typescript file, define PoolStream:

```typescript
import {
  PoolStream,
  Transaction,
  Currency,
  WalletAddress,
  Balance,
  SignebleTransaction,
  SignedTransaction,
} from "poolstream";
```

Please note that this is not the same as v5.x. If you want to dive into more differences, check out [migration guide](https://tronweb.network/docu/docs/6.0.0/Migrating%20from%20v5)

When you instantiate PoolStream you can define

- First Param. Ex.: "https://api.poolstream.io"

you can also set a

- apiKey: Some features need this parameter.

```js
const poolStream = new PoolStream({
  "https://api.poolstream.io",
  { apiKey: "your api key" },
});
```

Find a transaction. This method returns a list of transactions, as some cryptocurrencies encompass multiple fund transfers in one.

```js
const transaction = poolStream.transaction(
  "usdt",
  "tron",
  "26cfbd7d5d7b68537773e8e9889469fd18749816a10ff25e33f25393553bcdb6"
);
```

Find many transaction. It is not mandatory to pass the filter, but if it is not passed, the method will return the latest transactions. The maximum number of transactions returned is defined in the site documentation.

- start [ timestamp unix ]: The earliest timestamp a transaction can have to be included in search results.
- end [ timestamp unix ]: The newest timestamp a transaction can have to be included in search results.
- from: Transaction origin address.
- to: Transaction destination address.
- limit: Limit of results. If it is zero or less than zero, then it follows the default address defined in the site's documentation.

```ts
const filter = {
  start: 1729464035,
  end: 1730328030,
  from: "TV2SzAWinU4p7XiTd5UetwWHqRPaa1wT3z",
  to: "T9yutTZ2z6yGA7hHuHupndQwmaSrAizE7R",
  limit: 10,
};
const transactions = poolStream.transactions("usdt", "tron", filter);
```

Check the balance of one or more wallets.

```ts
const balance = poolStream.balance(
  "usdt",
  "tron",
  "TV2SzAWinU4p7XiTd5UetwWHqRPaa1wT3z"
);
```

or

```ts
const balance = poolStream.balance("usdt", "tron", [
  "TV2SzAWinU4p7XiTd5UetwWHqRPaa1wT3z",
  "T9yutTZ2z6yGA7hHuHupndQwmaSrAizE7R",
]);
```

Generate Wallet Address.

```ts
const balance = poolStream.generateWalletAddress("usdt", "tron");
```

Signs and submits the transaction to the network.

```ts
const txid = poolStream.signedAndSubmitTransaction("usdt", "tron", {
  from: "TV2SzAWinU4p7XiTd5UetwWHqRPaa1wT3z";
  to: "T9yutTZ2z6yGA7hHuHupndQwmaSrAizE7R";
  amount: 12000000, //int64
  fee: 350000 // int64
  privateKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
});
```

## Licence

PoolStream is distributed under a Creative Commons Legal Code licence.

```

```
