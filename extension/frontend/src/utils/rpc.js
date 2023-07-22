import { ethers } from 'ethers';

function createProvider(name, defaultRpc, chainId) {
    if (process.env.HISTORICAL) {
        if (chainId === 1) {
            log.info(
                'RPC providers set to historical, only the first RPC provider will be used'
            );
        }
        return new ethers.providers.StaticJsonRpcProvider(
            (process.env[name.toUpperCase() + '_RPC'] ?? defaultRpc).split(
                ','
            )[0],
            {
                name,
                chainId,
            }
        );
    } else {
        return new ethers.providers.FallbackProvider(
            (process.env[name.toUpperCase() + '_RPC'] ?? defaultRpc)
                .split(',')
                .map((url, i) => ({
                    provider: new ethers.providers.StaticJsonRpcProvider(url, {
                        name,
                        chainId,
                    }),
                    priority: i,
                })),
            1
        );
    }
}
export const providers = {
    arbitrum: createProvider('arbitrum', 'https://arb1.arbitrum.io/rpc', 42161),
};

export const getArbitrumChainProvider = () => {
    return new ethers.providers.JsonRpcProvider(Jrpcs.arbitrum);
};
