import { CoinNetworkModule } from "../../../coin-network-modules";
import { SignableTransaction } from "../../../signable-transaction";
import { SignedTransaction } from "../../../signed-transaction";
import { WalletAddress } from "../../../wallet-address";

export class UsdtTron implements CoinNetworkModule {
  signTransaction(
    transaction: SignableTransaction
  ): Promise<SignedTransaction> {
    throw new Error("Method not implemented.");
  }
  generateWalletAddress(): Promise<WalletAddress> {
    throw new Error("Method not implemented.");
  }
}
