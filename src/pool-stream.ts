import { Balance } from "./balance";
import { Coin } from "./coin";
import { getCoinNetworkModule } from "./coin-network-modules";
import { SignableTransaction } from "./signable-transaction";
import { SignedTransaction } from "./signed-transaction";
import { Transaction } from "./transaction";
import { TransactionSubmissionResult } from "./transaction-submission-result";
import { WalletAddress } from "./wallet-address";
import axios from "axios";

export interface PoolStreamOptions {
  apiKey?: string;
}

export class PoolStream {
  constructor(private uri: string, private options: PoolStreamOptions = {}) {}

  public async transaction(
    txid: string,
    coin: string,
    network?: string
  ): Promise<Transaction> {
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.uri}/auth/rest/v1/${coin}_${network}/transaction/${txid}`,
      responseType: "json",
    });
  }

  public async transactions(
    coin: string,
    network: string,
    start: number | null,
    end: number | null,
    from: string | null,
    to: string | null,
    limit: number | null
  ): Promise<Array<Transaction>> {
    let query: string = "";
    if (start || end || from || to || limit) {
      query = "?";
      if (start) {
        query += `start=${start}`;
      }
      if (end) {
        query += `${this.addAmpersand(query)}end=${end}`;
      }
      if (from) {
        query += `${this.addAmpersand(query)}from=${from}`;
      }
      if (to) {
        query += `${this.addAmpersand(query)}to=${to}`;
      }
      if (limit) {
        query += `${this.addAmpersand(query)}limit=${limit}`;
      }
    }
    return await axios({
      method: "get",
      headers: { ...this.apiKeyHeader() },
      url: `${this.uri}/${coin}_${network}/transactions${query}`,
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
      url: `${this.uri}/${coin}_${network}/balances${query}`,
      responseType: "json",
    });
  }

  public async cois(): Promise<Array<Coin>> {
    return await axios({
      method: "get",
      url: `${this.uri}/coins`,
      responseType: "json",
    });
  }

  public async submitTransaction(
    coin: string,
    network: string,
    signedTransaction: SignedTransaction
  ): Promise<TransactionSubmissionResult> {
    return await axios({
      method: "post",
      headers: { ...this.apiKeyHeader() },
      url: `${this.uri}/${coin}_${network}/submitSignedTransaction`,
      responseType: "json",
    });
  }

  public async signedAndSubmitTransaction(
    coin: string,
    network: string,
    signableTransaction: SignableTransaction
  ): Promise<TransactionSubmissionResult> {
    const signedTransaction: SignedTransaction = await getCoinNetworkModule(
      coin,
      network
    ).signTransaction(signableTransaction);
    return await this.submitTransaction(coin, network, signedTransaction);
  }

  public async signTransaction(
    signableTransaction: SignableTransaction,
    coin: string,
    network: string
  ): Promise<SignedTransaction> {
    const signedTransaction: SignedTransaction = await getCoinNetworkModule(
      coin,
      network
    ).signTransaction(signableTransaction);
    return signedTransaction;
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

  private addAmpersand(query: string): string {
    return query === "" ? "" : "&";
  }

  private apiKeyHeader(): { API_KEY: string } {
    if (this.options.apiKey) {
      return { API_KEY: this.options.apiKey };
    }
    throw new Error("API_KEY is required.");
  }
}
