import { providers } from 'ethers';

const provider = new providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);

export default provider;
