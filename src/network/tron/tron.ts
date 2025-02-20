import { TronWeb, utils, Contract } from "tronweb";
import { SignebleTransaction } from "../../transaction";
import { CurrencyNetworkModule } from "../../currency-network-module";
import { WalletAddress } from "../../walletaddress";

export abstract class Tron implements CurrencyNetworkModule {
  readonly tronWeb: TronWeb;

  constructor(test: boolean) {
    this.tronWeb = new TronWeb({
      fullHost: test
        ? "https://api.shasta.trongrid.io"
        : "https://api.trongrid.io",
    });
  }

  readonly network = "tron";

  async generateWalletAddress(): Promise<WalletAddress> {
    const result = utils.accounts.generateAccount();
    return {
      address: result.address.base58,
      secret: result.privateKey,
      currency: "trx",
      network: "tron",
      raw: result,
    };
  }

  abstract signTransaction(transaction: SignebleTransaction): Promise<string>;
}

const functionSelector = "transfer(address, uint256)";
export class GenericTron extends Tron {
  usdtContract: Contract | null = null;
  constructor(public readonly contractAddress: string, test: boolean = false) {
    super(test);
  }

  async signTransaction(transaction: SignebleTransaction): Promise<string> {
    if (this.usdtContract === null) {
      this.usdtContract = await this.tronWeb
        .contract()
        .at(this.contractAddress);
    }
    if (transaction.items.length < 0) {
      throw new Error("Incomplete transaction.");
    }
    const result = await Promise.all(
      transaction.items.map(async (item) => {
        const from = item.from;
        const parameter = [
          { type: "address", value: item.to },
          { type: "uint256", value: item.amount },
        ];
        const usdttransaction =
          await this.tronWeb.transactionBuilder.triggerSmartContract(
            this.contractAddress,
            functionSelector,
            { feeLimit: transaction.fee },
            parameter,
            from
          );

        const signedTransaction = utils.crypto.signTransaction(
          item.secret,
          usdttransaction.transaction
        );
        return btoa(JSON.stringify(signedTransaction));
      })
    );
    return btoa(JSON.stringify(result));
  }
}

export class TrxTron extends Tron {
  constructor(test: boolean = false) {
    super(test);
  }

  async signTransaction(
    signebleTransaction: SignebleTransaction
  ): Promise<string> {
    const result = await Promise.all(
      signebleTransaction.items.map(async (item) => {
        const transaction = await this.tronWeb.transactionBuilder.sendTrx(
          item.to,
          parseInt(item.amount),
          item.from
        );
        return this.tronWeb.trx.sign(transaction, item.secret);
      })
    );
    return btoa(JSON.stringify(result));
  }
}
