import { utils, BigNumber } from 'ethers';

import web3 from '../providers/web3';
import contract from '../contract/opensea';

type Sale = {
	transactionHash: string;
	maker: string;
	taker: string;
	price: string;
};

export async function fetchSales() {
	const latestBlock = await web3.getBlockNumber();

	// Add a toBlock paramter to the queryFilter if you would like to get sales between two blocks
	const filterFrom = contract.filters.OrdersMatched();
	const orders = await contract.queryFilter(filterFrom, latestBlock);

	const sales = await Promise.all(
		orders.map(async (order) => {
			if (!order.args) return null;
			const { transactionHash } = order;
			const { maker, taker, price } = order.args;

			return {
				transactionHash,
				maker,
				taker,
				price: utils.formatEther(price as BigNumber),
			};
		}),
	);

	return sales.filter((sale): sale is Sale => !!sale);
}
