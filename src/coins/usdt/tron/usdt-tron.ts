import { CurrencyNetworkModule } from "../../../currency-network-modules";

import { SignebleTransaction, SignedTransaction } from "../../../transaction";
import { WalletAddress } from "../../../walletaddress";
import { Contract, TronWeb, utils } from "tronweb";

const usdtContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const tronWeb = new TronWeb({ fullHost: "https://api.trongrid.io" });
export class UsdtTron implements CurrencyNetworkModule {
  usdtContract: Contract | null = null;

  async signTransaction(
    transaction: SignebleTransaction | Array<SignebleTransaction>
  ): Promise<SignedTransaction | Array<SignedTransaction>> {
    if (this.usdtContract === null) {
      this.usdtContract = await tronWeb.contract().at(usdtContractAddress);
    }

    if (Array.isArray(transaction)) {
      return await Promise.all(
        transaction.map(async (transaction) => await this.sign(transaction))
      );
    }
    return await this.sign(transaction);
  }

  private async sign(
    transaction: SignebleTransaction
  ): Promise<SignedTransaction> {
    const from = transaction.from;
    if (this.usdtContract === null) {
      throw new Error("USDT Contract Address is null.");
    }
    const usdttransaction = await this.usdtContract.methods
      .transfer(transaction.to, transaction.amount)
      .send({
        from,
        feeLimit: transaction.fee,
      });

    const signedTransaction = utils.crypto.signTransaction(
      transaction.privateKey,
      usdttransaction
    );
    const signature: string = btoa(
      JSON.stringify({
        signature: signedTransaction.signature,
        contract_address: signedTransaction.contract_address,
      })
    );
    return { ...transaction, signature };
  }

  async generateWalletAddress(): Promise<WalletAddress> {
    const account = utils.accounts.generateAccount();
    return {
      address: account.address.base58,
      privateKey: account.privateKey,
      publicKey: account.publicKey,
      currency: "usdt",
      network: "tron",
      raw: account,
    };
  }
}
