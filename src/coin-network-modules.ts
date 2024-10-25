import { UsdtTron } from "./coins/usdt/tron/usdt-tron";
import { SignableTransaction } from "./signable-transaction";
import { SignedTransaction } from "./signed-transaction";
import { WalletAddress } from "./wallet-address";

export interface CoinNetworkModule {
  signTransaction(transaction: SignableTransaction): Promise<SignedTransaction>;
  generateWalletAddress(): Promise<WalletAddress>;
}

export function getCoinNetworkModule(
  coin: string,
  network: string
): CoinNetworkModule {
  const cn: string = `${coin}_${network}`.toUpperCase();
  switch (cn) {
    case "USDT_TRON":
      return new UsdtTron();
    default:
      throw new Error("Coin/Network not available.");
  }
}
