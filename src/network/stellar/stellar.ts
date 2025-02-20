import {
  Horizon,
  Keypair,
  Asset,
  BASE_FEE,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { SignebleTransaction } from "../../transaction";

import { CurrencyNetworkModule } from "../../currency-network-module";
import { WalletAddress } from "../../walletaddress";

import * as crypto from "crypto";

export abstract class Stellar implements CurrencyNetworkModule {
  readonly server: Horizon.Server;
  readonly network = "stellar";
  constructor(test: boolean) {
    this.server = new Horizon.Server(
      test
        ? "https://horizon-testnet.stellar.org"
        : "https://horizon-futurenet.stellar.org"
    );
  }

  abstract signTransaction(transaction: SignebleTransaction): Promise<string>;

  async generateWalletAddress(): Promise<WalletAddress> {
    const randomBytes = crypto.randomBytes(32);
    const result = Keypair.fromRawEd25519Seed(Buffer.from(randomBytes));

    return {
      address: result.publicKey(),
      secret: result.secret(),
      currency: "xlm",
      network: "stellar",
      raw: result,
    };
  }
}

export class GenericStellar extends Stellar {
  constructor(protected readonly assetAddress: string, test: boolean = false) {
    super(test);
  }
  test = {
    signebleTransaction: {
      fee: 350000,
      items: [
        {
          from: "TKTcGX3tVBk8Y5p5uhFTqcEXT4Tg7C9iTD",
          privateKey:
            "4d6e85f83e2e0e7fd78413e11662323f8bf8daa05089f520ec8dc2bb98996863",
          to: "TRrEckDtWQWGpZHTT477VpAxaq1mFTbas5",
          amount: "230000000000000000",
        },
      ],
    },
  };

  async signTransaction(transaction: SignebleTransaction): Promise<string> {
    if (transaction.items.length < 0) {
      throw new Error("Incomplete transaction.");
    }
    const result = await Promise.all(
      transaction.items.map(async (item) => {
        const senderAccount = await this.server.loadAccount(item.from);

        let transactionBuilder = new TransactionBuilder(senderAccount, {
          fee: BASE_FEE,
          networkPassphrase: Networks.FUTURENET,
        }).addOperation(
          Operation.payment({
            destination: item.to,
            asset: Asset.native(),
            amount: item.amount,
          })
        );

        if (item.extra) {
          if (item.extra.memo) {
            transactionBuilder = transactionBuilder.addMemo(
              Memo.text(item.extra.memo)
            );
          }
          if (item.extra.timeout) {
            transactionBuilder = transactionBuilder.setTimeout(
              item.extra.timeout
            );
          }
        }

        const senderKeypair = Keypair.fromSecret(item.secret);
        const signedTransaction = transactionBuilder
          .build()
          .sign(senderKeypair);

        return btoa(JSON.stringify(signedTransaction));
      })
    );
    return btoa(JSON.stringify(result));
  }
}

export class XlmStellar extends Stellar {
  constructor(test: boolean = false) {
    super(test);
  }
  async signTransaction(
    signebleTransaction: SignebleTransaction
  ): Promise<string> {
    const signTransactions = Promise.all(
      signebleTransaction.items.map(async (item) => {
        const account = await this.server.loadAccount(item.from);
        let transactionBuilder = new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase: Networks.FUTURENET,
        }).addOperation(
          Operation.payment({
            destination: item.to,
            asset: Asset.native(),
            amount: item.amount,
          })
        );
        if (item.extra) {
          if (item.extra.memo) {
            transactionBuilder = transactionBuilder.addMemo(
              Memo.text(item.extra.memo)
            );
          }
          if (item.extra.timeout) {
            transactionBuilder = transactionBuilder.setTimeout(
              item.extra.timeout
            );
          }
        }

        const signedTransaction = transactionBuilder
          .build()
          .sign(Keypair.fromSecret(item.secret));
        return btoa(JSON.stringify(signedTransaction));
      })
    );
    return btoa(JSON.stringify(signTransactions));
  }
}
