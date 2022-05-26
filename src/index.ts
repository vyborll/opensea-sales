import 'dotenv/config';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { fetchSales } from './lib/sales';

const HTTP_PORT: number = parseInt(process.env.HTTP_PORT || '3000');

async function main() {
	const app = express();
	const server = http.createServer(app);
	const wss = new WebSocket.Server({ noServer: true });

	server.on('upgrade', (request, socket, head) => {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit('connection', ws, request);
		});
	});

	wss.on('connection', (ws, request) => {
		wss.on('message', (message) => console.log(message));
	});

	setInterval(async () => {
		const sales = await fetchSales();
		sales.map((sale) => console.log(sale));
		wss.clients.forEach((client) => client.send(JSON.stringify(sales)));
	}, 20000);

	server.listen(HTTP_PORT, () => {
		console.log(`Server is listening on port ${HTTP_PORT}`);
	});
}

main();
