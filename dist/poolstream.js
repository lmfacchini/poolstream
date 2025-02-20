import { getCoinNetworkModule } from "./currency-network-module";
import axios from "axios";
export class PoolStream {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
    }
    async transaction(coin, network, txid) {
        return await axios({
            method: "get",
            headers: { ...this.apiKeyHeader() },
            url: `${this.url}/auth/rest/v1/${coin}/${network}/transaction/${txid}`,
            responseType: "json",
        });
    }
    async info(params) {
        return await axios({
            method: "get",
            headers: { ...this.apiKeyHeader() },
            url: `${this.url}/auth/rest/v1/${params.network}/info`,
            responseType: "json",
        });
    }
    async transactions(params) {
        const query = Object.entries(params.filter ? params.filter : {})
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        return await axios({
            method: "get",
            headers: { ...this.apiKeyHeader() },
            url: `${this.url}/auth/rest/v1/${params.network}${params.contractAddress ? `/${params.contractAddress}` : ""}/transactions?${query}`,
            responseType: "json",
        });
    }
    async balances(params) {
        let query = "?";
        if (typeof params.addresses === "string") {
            query += params.addresses;
        }
        else {
            for (let i = 0; i < params.addresses.length; i++) {
                query = `${i > 0 ? "&" : ""}addresses=${params.addresses}`;
            }
        }
        return await axios({
            method: "get",
            headers: { ...this.apiKeyHeader() },
            url: `${this.url}/auth/rest/v1/${params.network}${params.contractAddress ? `/${params.contractAddress}` : ""}/balances${query}`,
            responseType: "json",
        });
    }
    async networks() {
        return await axios({
            method: "get",
            url: `${this.url}/networks`,
            responseType: "json",
        });
    }
    async submitTransaction(params) {
        return await axios({
            method: "post",
            headers: { ...this.apiKeyHeader() },
            url: `${this.url}/auth/rest/v1/${params.network}${params.contractAddress ? `/${params.contractAddress}` : ""}/submitSignedTransaction`,
            responseType: "json",
            data: { signedTransaction: params.signedTransaction },
        });
    }
    async signedAndSubmitTransaction(params) {
        const signedTransaction = await getCoinNetworkModule(params.network, false, params.contractAddress).signTransaction(params.transaction);
        return await this.submitTransaction({
            network: params.network,
            signedTransaction,
            contractAddress: params.contractAddress,
        });
    }
    async signTransaction(params) {
        return await getCoinNetworkModule(params.network, false, params.contractAddress).signTransaction(params.transaction);
    }
    async generateWalletAddress(network) {
        const walletAddress = await getCoinNetworkModule(network).generateWalletAddress();
        return walletAddress;
    }
    apiKeyHeader() {
        if (this.options.apiKey) {
            return { API_KEY: this.options.apiKey };
        }
        throw new Error("API_KEY is required.");
    }
}
//# sourceMappingURL=poolstream.js.map