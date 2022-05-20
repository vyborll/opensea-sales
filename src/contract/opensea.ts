import { Contract } from 'ethers';

import web3 from '../providers/web3';
import openseaABI from '../abi/opensea_abi.json';

export default new Contract('0x7f268357a8c2552623316e2562d90e642bb538e5', openseaABI, web3);
