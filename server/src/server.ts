import { Server } from 'socket.io';
import express, { Response } from 'express';
import cors from 'cors';
import initSocket from './SocketService';
import { Lobby } from './Lobby';
import { Socket } from 'socket.io-client';

// import { handler } from './build/handler.js';
// const express = require('express');
// const cors = require('cors');

const PORT = process.env.PORT ?? 2400;

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

	const wss = new Server(3000, { cors: { origin: '*' } });
	const ttl = 60 * 1000 * 10; // 10 minutes

	app.get('/validate/:lobbyName/:username', (req, res) => {
		const { lobbyName, username } = req.params;

		if (!lobbyName || !username)
			return res.json({ success: false, reason: 'Bad request' }).status(400);

		const foundLobby = activeLobbies.find((x) => x.name == lobbyName);
		if (!foundLobby)
			return res.json({ success: false, reason: 'Lobby already exists' }).status(409);

		if (foundLobby.state.getUserByUsername(username))
			return res.json({ success: false, reason: 'Username is taken' }).status(409);

		return res.json({ sucess: true }).status(200);
	});

	app.post('/create_lobby', (req, res) => {
		const { lobbyName, initialState } = req.body;

		if (!lobbyName || !initialState)
			return res.json({ sucess: false, reason: 'Bad request' }).status(400);

		// TODO: payload validation

		if (activeLobbies.find((x) => x.name == lobbyName))
			return res.json({ sucess: false, reason: 'Lobby already exists' }).status(400);

		const lobby = new Lobby(initialState);
		initSocket(wss, lobbyName, lobby, ttl);
		activeLobbies.push({ name: lobbyName, state: lobby, expires: new Date().getTime() + ttl });

		res.json({ sucess: true }).status(200);
	});

	// app.use(handler);
	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
