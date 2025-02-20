import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, Transaction, } from "@solana/web3.js";
export class Solana {
    constructor(test = false) {
        this.network = "solana";
        this.connection = new Connection(clusterApiUrl(test ? "devnet" : "mainnet-beta"));
    }
    async generateWalletAddress() {
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
    constructor(test = false) {
        super(test);
    }
    async signTransaction(signebleTransaction) {
        const signTransactions = Promise.all(signebleTransaction.items.map(async (item) => {
            const senderSecretKey = Uint8Array.from(Buffer.from(item.secret, "hex"));
            const sender = Keypair.fromSecretKey(senderSecretKey);
            const receiver = new PublicKey(item.to);
            const { blockhash } = await this.connection.getLatestBlockhash();
            const transaction = new Transaction().add(SystemProgram.transfer({
                fromPubkey: new PublicKey(item.from),
                toPubkey: receiver,
                lamports: parseInt(item.amount),
            }));
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = sender.publicKey;
            transaction.sign(sender);
            return transaction.serialize().toString("base64");
        }));
        return btoa(JSON.stringify(signTransactions));
    }
}
const modules = { sol: (test = false) => new SolSolana() };
//# sourceMappingURL=solana.js.map