import { Ripple } from "./network/ripple/ripple";
import { Solana } from "./network/solana/solana";
import { Stellar } from "./network/stellar/stellar";
import { Tron } from "./network/tron/tron";
import { SignebleTransaction } from "./transaction";
import { WalletAddress } from "./walletaddress";

export interface CurrencyNetworkModule {
  signTransaction(transaction: SignebleTransaction): Promise<string>;
  generateWalletAddress(): Promise<WalletAddress>;

  readonly network: string;
}

export function getCoinNetworkModule(
  network: string,
  test: boolean = false,
  contractAddress?: string
): CurrencyNetworkModule {
  network = network.toLowerCase();
  const nw = networks[network];
  if (nw) {
    const instanceCurrencyModule = nw.currencies(contractAddress);
    if (instanceCurrencyModule) {
      return instanceCurrencyModule(test);
    }
    throw new Error(
      `Contract Address [${contractAddress}]. Network [${network}] not available.`
    );
  }
  throw new Error(`Network [${network}] not available.`);
}

export const networks: any = {
  tron: Tron,
  stellar: Stellar,
  solana: Solana,
  ripple: Ripple,
};
