export interface Balance {
  currency: string;
  network: string;
  availables: { [key: string]: number };
  decimals: number;
}
