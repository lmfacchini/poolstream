export interface Transaction {
  from: string;
  to: string;
  amount: number;
  fee: number;
}

export interface SignebleTransaction extends Transaction {
  privateKey: string;
}

export interface SignedTransaction extends Transaction {
  signature: string;
}
