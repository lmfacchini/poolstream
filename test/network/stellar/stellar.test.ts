import { describe, expect } from "@jest/globals";

import { SignebleTransaction } from "../../../src/transaction";
import {
  GenericStellar,
  XlmStellar,
} from "../../../src/network/stellar/stellar";

describe("Solana", () => {
  const xlm: XlmStellar = new XlmStellar(true);
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
          from: "GB7S3QUIAE3K3T7RVH66CMMBMRYBQ4BEEGWUK3ADWGRNEVHHUIEKP7LM",
          secret:
            "cf297e17b5d59b3b60f2c171171cfe3738fa7c8ba671f51975e1b8ef7a150dade985bc54e3cfdbbe146fe481c46a09f6a53285980881642077c96e04e6d165f7",
          to: "GDRRLB7VENXM3ZYGO5NWUIIFLFRWDYJC3B735F45D2B6TCOOWEEYN655",
          amount: "300000",
        },
      ],
    };
    xlm
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });

  test("Sign Transaction with contract", () => {
    const generic: GenericStellar = new GenericStellar(
      "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      true
    );
    const signebleTransaction: SignebleTransaction = {
      items: [
        {
          from: "GB7S3QUIAE3K3T7RVH66CMMBMRYBQ4BEEGWUK3ADWGRNEVHHUIEKP7LM",
          secret:
            "cf297e17b5d59b3b60f2c171171cfe3738fa7c8ba671f51975e1b8ef7a150dade985bc54e3cfdbbe146fe481c46a09f6a53285980881642077c96e04e6d165f7",
          to: "GDRRLB7VENXM3ZYGO5NWUIIFLFRWDYJC3B735F45D2B6TCOOWEEYN655",
          amount: "300000",
        },
      ],
    };
    generic
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });
});
