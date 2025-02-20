import { Balance } from "./balance";
import { Network } from "./network";
import { getCoinNetworkModule } from "./currency-network-module";
import { SignebleTransaction, SubmittedTransaction } from "./transaction";
import { WalletAddress } from "./walletaddress";
import axios from "axios";

export interface PoolStreamOptions {
  apiKey?: string;
}

export interface TransactionFilter {
  start?: number;
  end?: number;
  from?: string;
  to?: string;
  limit?: number;
}

export class PoolStream {
  constructor(private url: string, private options: PoolStreamOptions = {}) {}

  public async transaction(
    coin: string,
    network: string,
    txid: string
  ): Promise<SubmittedTransaction> {
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${coin}/${network}/transaction/${txid}`,
      responseType: "json",
    });
  }

  public async info(params: { network: string }) {
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${params.network}/info`,
      responseType: "json",
    });
  }

  public async transactions(params: {
    network: string;
    filter?: TransactionFilter;
    contractAddress?: string;
  }): Promise<Array<SubmittedTransaction>> {
    const query = Object.entries(params.filter ? params.filter : {})
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${params.network}${
        params.contractAddress ? `/${params.contractAddress}` : ""
      }/transactions?${query}`,
      responseType: "json",
    });
  }

  public async balances(params: {
    network: string;
    addresses: string | Array<string>;
    contractAddress?: string;
  }): Promise<Balance> {
    let query: string = "?";

    if (typeof params.addresses === "string") {
      query += params.addresses;
    } else {
      for (let i = 0; i < params.addresses.length; i++) {
        query = `${i > 0 ? "&" : ""}addresses=${params.addresses}`;
      }
    }
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${params.network}${
        params.contractAddress ? `/${params.contractAddress}` : ""
      }/balances${query}`,
      responseType: "json",
    });
  }

  public async networks(): Promise<Array<Network>> {
    return await axios({
      method: "get",
      url: `${this.url}/networks`,
      responseType: "json",
    });
  }

  public async submitTransaction(params: {
    network: string;
    signedTransaction: string;
    contractAddress?: string;
  }): Promise<Array<string>> {
    return await axios({
      method: "post",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${params.network}${
        params.contractAddress ? `/${params.contractAddress}` : ""
      }/submitSignedTransaction`,
      responseType: "json",
      data: { signedTransaction: params.signedTransaction },
    });
  }

  public async signedAndSubmitTransaction(params: {
    network: string;
    transaction: SignebleTransaction;
    contractAddress?: string;
  }): Promise<Array<string>> {
    const signedTransaction = await getCoinNetworkModule(
      params.network,
      false,
      params.contractAddress
    ).signTransaction(params.transaction);
    return await this.submitTransaction({
      network: params.network,
      signedTransaction,
      contractAddress: params.contractAddress,
    });
  }

  public async signTransaction(params: {
    network: string;
    transaction: SignebleTransaction;
    contractAddress?: string;
  }): Promise<string> {
    return await getCoinNetworkModule(
      params.network,
      false,
      params.contractAddress
    ).signTransaction(params.transaction);
  }

  public async generateWalletAddress(network: string): Promise<WalletAddress> {
    const walletAddress: WalletAddress = await getCoinNetworkModule(
      network
    ).generateWalletAddress();
    return walletAddress;
  }
  private apiKeyHeader(): { API_KEY: string } {
    if (this.options.apiKey) {
      return { API_KEY: this.options.apiKey };
    }
    throw new Error("API_KEY is required.");
  }
}
