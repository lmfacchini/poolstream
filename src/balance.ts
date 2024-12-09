export interface Balance {
  currency: string;
  network: string;
  availables: { [key: string]: string };
  decimals: number;
}
