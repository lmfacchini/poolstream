import { SignebleTransaction } from "../../transaction";

import { CurrencyNetworkModule } from "../../currency-network-module";
import { WalletAddress } from "../../walletaddress";

import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export abstract class Solana implements CurrencyNetworkModule {
  readonly connection;
  readonly network = "solana";
  constructor(test: boolean = false) {
    this.connection = new Connection(
      clusterApiUrl(test ? "devnet" : "mainnet-beta")
    );
  }

  abstract signTransaction(transaction: SignebleTransaction): Promise<string>;

  async generateWalletAddress(): Promise<WalletAddress> {
    const wallet = Keypair.generate();
    return {
      address: wallet.publicKey.toBase58(),
      secret: Buffer.from(wallet.secretKey).toString("hex"),
      currency: "sol",
      network: this.network,
      raw: wallet,
    };
  }
}

export class SolSolana extends Solana {
  constructor(test: boolean = false) {
    super(test);
  }
  async signTransaction(
    signebleTransaction: SignebleTransaction
  ): Promise<string> {
    const signTransactions = Promise.all(
      signebleTransaction.items.map(async (item) => {
        const senderSecretKey = Uint8Array.from(
          Buffer.from(item.secret, "hex")
        );
        const sender = Keypair.fromSecretKey(senderSecretKey);
        const receiver = new PublicKey(item.to);
        const { blockhash } = await this.connection.getLatestBlockhash();
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(item.from),
            toPubkey: receiver,
            lamports: parseInt(item.amount),
          })
        );
        transaction.recentBlockhash = blockhash;

        transaction.feePayer = sender.publicKey;

        transaction.sign(sender);

        return transaction.serialize().toString("base64");
      })
    );
    return btoa(JSON.stringify(signTransactions));
  }
}

const modules = { sol: (test: boolean = false) => new SolSolana() };
