import { Wallet } from "xrpl";
export class Ripple {
    constructor() {
        this.network = "ripple";
    }
    async generateWalletAddress() {
        const wallet = Wallet.generate();
        return {
            address: wallet.classicAddress,
            secret: wallet.seed ? wallet.seed : wallet.privateKey,
            currency: "xrp",
            network: this.network,
            raw: wallet,
        };
    }
}
// export class GenericRipple extends Ripple {
//   constructor(protected readonly assetAddress: string, currency: string) {
//     super(currency);
//   }
//   async signTransaction(transaction: SignebleTransaction): Promise<string> {
//     throw new Error("Method not implemented.");
//   }
// }
export class XrpRipple extends Ripple {
    constructor() {
        super();
    }
    async signTransaction(signebleTransaction) {
        const signTransactions = Promise.all(signebleTransaction.items.map(async (item) => {
            const seedWallet = Wallet.fromSeed(item.secret);
            const Memos = item.extra ? item.extra.memos : undefined;
            const Fee = signebleTransaction.fee
                ? signebleTransaction.fee.toString()
                : undefined;
            const tx = {
                TransactionType: "Payment",
                Account: item.from,
                Destination: item.to,
                Amount: item.amount,
                Memos,
                Fee,
            };
            const signedTx = seedWallet.sign(tx);
            return btoa(JSON.stringify(signedTx.tx_blob));
        }));
        return btoa(JSON.stringify(signTransactions));
    }
}
//# sourceMappingURL=ripple.js.map