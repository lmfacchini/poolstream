import { describe, expect } from "@jest/globals";

import { SignebleTransaction } from "../../../src/transaction";
import { GenericTron, TrxTron } from "../../../src/network/tron/tron";

describe("Solana", () => {
  const xlm: TrxTron = new TrxTron(true);
  test("Generate Wallet", () => {
    xlm.generateWalletAddress().then((wallet) => {
      expect(wallet).toBeDefined();
      expect(wallet.address).toBeDefined();
      expect(wallet.secret).toBeDefined();
      expect(wallet.raw).toBeDefined();
    });
  });
  test("Sign Transaction", () => {
    const signebleTransaction: SignebleTransaction = {
      items: [
        {
          from: "TEKzMAQ9TcMZFQj83V5TKg4dHgAHJT7EeB",
          secret:
            "AE4DD4F51C1CE099D58BBC5EB693C7B6F747706D3C8AF71078A8B0B65FB203BF",
          to: "TM1zzNDZD2DPASbKcgdVoTYhfmYgtfwx9R",
          amount: "300000",
        },
      ],
    };
    xlm
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });

  test("Sign Transaction with contract", () => {
    const generic: GenericTron = new GenericTron(
      "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
      true
    );
    const signebleTransaction: SignebleTransaction = {
      items: [
        {
          from: "TEKzMAQ9TcMZFQj83V5TKg4dHgAHJT7EeB",
          secret:
            "AE4DD4F51C1CE099D58BBC5EB693C7B6F747706D3C8AF71078A8B0B65FB203BF",
          to: "TM1zzNDZD2DPASbKcgdVoTYhfmYgtfwx9R",
          amount: "300000",
        },
      ],
    };
    generic
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });
});
