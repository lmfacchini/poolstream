import { TronWeb, utils } from "tronweb";
export class Tron {
    constructor(test) {
        this.network = "tron";
        this.tronWeb = new TronWeb({
            fullHost: test
                ? "https://api.shasta.trongrid.io"
                : "https://api.trongrid.io",
        });
    }
    async generateWalletAddress() {
        const result = utils.accounts.generateAccount();
        return {
            address: result.address.base58,
            secret: result.privateKey,
            currency: "trx",
            network: "tron",
            raw: result,
        };
    }
}
const functionSelector = "transfer(address, uint256)";
export class GenericTron extends Tron {
    constructor(contractAddress, test = false) {
        super(test);
        this.contractAddress = contractAddress;
        this.usdtContract = null;
    }
    async signTransaction(transaction) {
        if (this.usdtContract === null) {
            this.usdtContract = await this.tronWeb
                .contract()
                .at(this.contractAddress);
        }
        if (transaction.items.length < 0) {
            throw new Error("Incomplete transaction.");
        }
        const result = await Promise.all(transaction.items.map(async (item) => {
            const from = item.from;
            const parameter = [
                { type: "address", value: item.to },
                { type: "uint256", value: item.amount },
            ];
            const usdttransaction = await this.tronWeb.transactionBuilder.triggerSmartContract(this.contractAddress, functionSelector, { feeLimit: transaction.fee }, parameter, from);
            const signedTransaction = utils.crypto.signTransaction(item.secret, usdttransaction.transaction);
            return btoa(JSON.stringify(signedTransaction));
        }));
        return btoa(JSON.stringify(result));
    }
}
export class TrxTron extends Tron {
    constructor(test = false) {
        super(test);
    }
    async signTransaction(signebleTransaction) {
        const result = await Promise.all(signebleTransaction.items.map(async (item) => {
            const transaction = await this.tronWeb.transactionBuilder.sendTrx(item.to, parseInt(item.amount), item.from);
            return this.tronWeb.trx.sign(transaction, item.secret);
        }));
        return btoa(JSON.stringify(result));
    }
}
//# sourceMappingURL=tron.js.map