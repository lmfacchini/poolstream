export interface Transaction {
  items: Array<TransactionItem>;
  fee: number;
  extra?: any;
}

export interface SignebleTransaction extends Transaction {
  privateKey: string;
}

export interface SignedTransaction extends Transaction {
  signature: string;
}

export interface TransactionItem {
  from: string;
  to: string;
  amount: string;
  extra?: any;
}

export interface SubmittedTransaction extends Transaction {
  txID: string;
  confirmations: number;
  decimals: number;
  timestamp: number;
}
