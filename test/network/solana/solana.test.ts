import { describe, expect } from "@jest/globals";

import { SignebleTransaction } from "../../../src/transaction";
import { SolSolana } from "../../../src/network/solana/solana";

describe("Solana", () => {
  const sol: SolSolana = new SolSolana(true);
  test("Generate Wallet", () => {
    sol.generateWalletAddress().then((wallet) => {
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
          from: "GEhoLG3dVqagLNX3UiSJ1jbQ22PJEVXSeCBU1J9aG1Jm",
          secret:
            "005fe7aed282313fb885c4713158f90f57a5a2a4e2ff3f31ab81f466e3efb932e261fc5d1d7ffbcbed624b519895596add389db24b2359bcd6287781209395ae",
          to: "oQPnhXAbLbMuKHESaGrbXT17CyvWCpLyERSJA9HCYd7",
          amount: "300000",
        },
      ],
    };
    sol
      .signTransaction(signebleTransaction)
      .then((result) => expect(result).toBeDefined());
  });
});
