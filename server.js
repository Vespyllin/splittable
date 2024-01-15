import { handler } from './build/handler.js';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT ?? 5173;

const lobbies = [];

const main = () => {
	const app = express();
	app.use(express.json());
	app.use(cors());

	const wss = new Server(3000, { cors: { origin: '*' } });

	app.get('/sanity', (req, res) => {
		res.json({ status: 'ok' }).sendStatus(200);
	});

	app.get('/check_lobby/:lobbyId', async (req, res) => {
		const { lobbyId } = req.params;

		console.log('check', lobbies);

		const expiryDate = lobbies.find((v) => v.id == lobbyId)?.expires;
		if (
			expiryDate
			// && expiryDate > new Date().getTime()
		) {
			res.sendStatus(200);
		} else {
			res.sendStatus(202);
		}
	});

	let x = 0;
	app.post('/create_lobby', (req, res) => {
		const { lobbyId, receiptEntries: initState } = req.body;

		if (!lobbyId || !initState) return res.sendStatus(400);

		wss.of(lobbyId).on('connection', (socket) => {
			socket.emit('messages', `message on ${lobbyId}`);
		});

		setInterval(() => {
			wss.of(lobbyId).emit('messages', { userID: 'abc', item: 'item', contribution: x++ / 3 });
		}, 500);

		wss
			.of(lobbyId)
			.timeout(60 * 10 * 1000)
			.disconnectSockets(true);

		const expiryDate = new Date().getTime() + 60 * 10 * 1000;
		lobbies.push({ id: lobbyId, expires: expiryDate });

		console.log('create', lobbies);

		res.sendStatus(200);
	});

	app.post('/send_lobby', (req, res) => {
		wss.of(req.body.lobbyId).emit('messages', `message ${new Date()}`);
		res.sendStatus(200);
	});

	app.use(handler);

	wss.on('connection', (socket) => {
		socket.emit('messages', "This guy's tutorial sucked so bad omg");
	});

	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
