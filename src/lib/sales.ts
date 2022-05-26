import { utils, BigNumber, providers } from 'ethers';

import { Standard, Sale } from '../types';
import web3 from '../providers/web3';
import contract from '../contract/opensea';

const erc721Transfer = new utils.Interface(['event Transfer(address indexed from, address indexed to, uint indexed tokenId)']);

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

			const receipt = await web3.getTransactionReceipt(transactionHash);
			const data = getTransaction(receipt.logs);
			if (!data) return null;

			return {
				transactionHash,
				standard: data.standard,
				contract: data.contract,
				maker,
				taker,
				tokenId: data.tokenId,
				price: utils.formatEther(price as BigNumber),
			};
		}),
	);

	return sales.filter((sale): sale is Sale => !!sale);
}

function getTransaction(logs: providers.Log[]) {
	const transfer = logs.filter((log) => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && log.data === '0x');

	if (transfer.length > 0) {
		const { address, data, topics } = transfer[0];
		const {
			args: { tokenId },
		} = erc721Transfer.parseLog({ data, topics });

		return {
			standard: Standard.ERC721,
			contract: address,
			tokenId: BigNumber.from((tokenId as BigNumber)._hex.toString()).toString(),
		};
	} else {
		return null;
	}
}
