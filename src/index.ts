import 'dotenv/config';
import { BigNumber, utils } from 'ethers';

import web3 from './providers/web3';
import contract from './contract/opensea';

async function main() {
	const latestBlock = await web3.getBlockNumber();

	const filterFrom = contract.filters.OrdersMatched();
	const orders = await contract.queryFilter(filterFrom, latestBlock);

	for (const order of orders) {
		if (!order.args) continue;
		const { transactionHash } = order;
		const { maker, taker, price } = order.args;

		console.log({
			transactionHash,
			maker,
			taker,
			price: utils.formatEther(price as BigNumber),
		});
	}
}

main();
