import { Ripple } from "./network/ripple/ripple";
import { Solana } from "./network/solana/solana";
import { Stellar } from "./network/stellar/stellar";
import { Tron } from "./network/tron/tron";
export function getCoinNetworkModule(network, test = false, contractAddress) {
    network = network.toLowerCase();
    const nw = networks[network];
    if (nw) {
        const instanceCurrencyModule = nw.currencies(contractAddress);
        if (instanceCurrencyModule) {
            return instanceCurrencyModule(test);
        }
        throw new Error(`Contract Address [${contractAddress}]. Network [${network}] not available.`);
    }
    throw new Error(`Network [${network}] not available.`);
}
export const networks = {
    tron: Tron,
    stellar: Stellar,
    solana: Solana,
    ripple: Ripple,
};
//# sourceMappingURL=currency-network-module.js.map