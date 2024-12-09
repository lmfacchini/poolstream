import { UsdtTron } from "./coins/usdt/tron/usdt-tron";
import { SignebleTransaction, SignedTransaction } from "./transaction";
import { WalletAddress } from "./walletaddress";

export interface CurrencyNetworkModule {
  signTransaction(
    transaction: SignebleTransaction | Array<SignebleTransaction>
  ): Promise<SignedTransaction | Array<SignedTransaction>>;
  generateWalletAddress(): Promise<WalletAddress>;
}

export function getCoinNetworkModule(
  coin: string,
  network: string
): CurrencyNetworkModule {
  const cn: string = `${coin}_${network}`.toUpperCase();
  switch (cn) {
    case "USDT_TRON":
      return new UsdtTron();
    default:
      throw new Error("Coin/Network not available.");
  }
}
