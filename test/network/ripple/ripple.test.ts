import { describe, expect } from "@jest/globals";

import { Ripple, XrpRipple } from "../../../src/network/ripple/ripple";
import { SignebleTransaction } from "../../../src/transaction";

describe("Ripple", () => {
  const xrp: Ripple = new XrpRipple();
  test("Generate Wallet", () => {
    xrp.generateWalletAddress().then((wallet) => {
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
          from: "rhFJJ3quwRJbx69UPeLYA4ZHE78fNNrHBK",
          secret: "sEdSx9mDQm3cV2ta5Ey1rRrncF3VwzQ",
          to: "rHzykWRVdAfEHk6c5fQxyYYHF9waQXN5Dz",
          amount: "300000",
        },
      ],
    };
    xrp
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });
});
