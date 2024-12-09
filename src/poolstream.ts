import { Balance } from "./balance";
import { Currency } from "./currency";
import { getCoinNetworkModule } from "./currency-network-modules";
import {
  SignebleTransaction,
  SignedTransaction,
  SubmittedTransaction,
  Transaction,
} from "./transaction";
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

  public async transactions(
    coin: string,
    network: string,
    filter: TransactionFilter = {}
  ): Promise<Array<SubmittedTransaction>> {
    const query = Object.entries(filter)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${coin}/${network}/transactions?${query}`,
      responseType: "json",
    });
  }

  public async balances(
    coin: string,
    network: string,
    addresses: string | Array<string>
  ): Promise<Balance> {
    let query: string = "?";

    if (typeof addresses === "string") {
      query += addresses;
    } else {
      for (let i = 0; i < addresses.length; i++) {
        query = `${i > 0 ? "&" : ""}addresses=${addresses}`;
      }
    }
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${coin}/${network}/balances${query}`,
      responseType: "json",
    });
  }

  public async currencies(): Promise<Array<Currency>> {
    return await axios({
      method: "get",
      url: `${this.url}/currencies`,
      responseType: "json",
    });
  }

  public async submitTransaction(
    coin: string,
    network: string,
    signedTransaction: SignedTransaction | Array<SignedTransaction>
  ): Promise<Array<string>> {
    return await axios({
      method: "post",
      headers: { ...this.apiKeyHeader() },
      url: `${this.url}/auth/rest/v1/${coin}/${network}/submitSignedTransaction`,
      responseType: "json",
      data: { signedTransaction },
    });
  }

  public async signedAndSubmitTransaction(
    coin: string,
    network: string,
    transaction: SignebleTransaction | Array<SignebleTransaction>
  ): Promise<Array<string>> {
    const signedTransaction = await getCoinNetworkModule(
      coin,
      network
    ).signTransaction(transaction);
    return await this.submitTransaction(coin, network, signedTransaction);
  }

  public async signTransaction(
    coin: string,
    network: string,
    transaction: SignebleTransaction | Array<SignebleTransaction>
  ): Promise<SignedTransaction | Array<SignedTransaction>> {
    return await getCoinNetworkModule(coin, network).signTransaction(
      transaction
    );
  }

  public async generateWalletAddress(
    coin: string,
    network: string
  ): Promise<WalletAddress> {
    const walletAddress: WalletAddress = await getCoinNetworkModule(
      coin,
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
