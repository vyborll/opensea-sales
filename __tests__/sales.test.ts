import 'dotenv/config';
import { fetchSales } from '../src/lib/sales';

describe('get opensea sales', () => {
	it('should return an array', async () => {
		const sales = await fetchSales();
		expect(Array.isArray(sales)).toBe(true);
	});
});
