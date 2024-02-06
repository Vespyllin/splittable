import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import initSocket from './SocketService';
import { Lobby } from './Lobby';

const SERVER_PORT = 3388;
const SOCKET_PORT = 4430;

const main = () => {
	const app = express();
	app.use(express.json());
	app.use(cors());

	let activeLobbies: { name: string; state: Lobby; expires: number }[] = [];
	setInterval(() => {
		const oldLobbies = [...activeLobbies];
		activeLobbies = activeLobbies.filter((x) => {
			return x.expires > new Date().getTime();
		});
		if (oldLobbies.length != activeLobbies.length)
			console.log(`Pruned ${oldLobbies.length - activeLobbies.length} lobbies`);
	}, 1000);

	const wss = new Server(SOCKET_PORT, { cors: { origin: '*' } });
	const ttl = 60 * 1000 * 10; // 10 minutes

	app.get('/exists/:lobbyName/:username?', (req, res) => {
		const { lobbyName, username } = req.params;

		if (!lobbyName) return res.json({ success: false }).status(400);

		const foundLobby = activeLobbies.find((x) => x.name == lobbyName);
		const lobbyExists = !!foundLobby;
		const usernameExists = !username
			? undefined
			: lobbyExists && !!foundLobby?.state.getUserByUsername(username);

		return res
			.json({ success: true, data: { lobby: lobbyExists, username: usernameExists } })
			.status(200);
	});

	app.post('/create_lobby', (req, res) => {
		const { lobbyName, initialState } = req.body;

		if (!lobbyName || !initialState)
			return res.json({ success: false, reason: 'Bad request' }).status(400);

		// TODO: payload validation

		if (activeLobbies.find((x) => x.name == lobbyName))
			return res.json({ success: false, reason: 'Lobby already exists' }).status(400);

		const lobby = new Lobby(initialState);
		initSocket(wss, lobbyName, lobby, ttl);
		activeLobbies.push({ name: lobbyName, state: lobby, expires: new Date().getTime() + ttl });

		res.json({ success: true }).status(200);
	});

	app.listen(SERVER_PORT, () => {
		console.log(`Hosting on port ${SERVER_PORT}`);
	});
};

main();
