export type Sale = {
	transactionHash: string;
	contract: string;
	standard: Standard;
	maker: string;
	taker: string;
	tokenId: string;
	price: string;
};

export enum Standard {
	ERC721 = 'ERC721',
	UNKNOWN = 'UNKNOWN',
}
