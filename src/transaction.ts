import { TokenTransfer } from "./token-transfer";

export interface Transaction {
  txid: string;
  type: string;
  timestamp: Date;
  from: string;
  to?: string;
  amount: number;
  currency: string;
  fee?: number;
  feeCurrency?: string;
  blockNumber?: number;
  status: string;
  network: string;
  memo?: string;
  contractAddress?: string;
  tokenTransfers?: Array<TokenTransfer>;
  rawData?: any;
}
