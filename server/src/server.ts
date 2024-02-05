import { Server } from 'socket.io';
import express, { Request, Response } from 'express';
import cors from 'cors';
import initSocket from './SocketService';
import { Lobby } from './Lobby';

// import { handler } from './build/handler.js';
// const express = require('express');
// const cors = require('cors');

const PORT = process.env.PORT ?? 2400;

const main = () => {
	const app = express();
	app.use(express.json());
	app.use(cors());

	const wss = new Server(3000, { cors: { origin: '*' } });

	app.get('/validate_join/:lobbyName/:username', async (req, res: Response) => {
		const { lobbyName, username } = req.params;

		return res.json({ valid: 'Valid' }).status(200);
	});

	app.post('/create_lobby', (req, res) => {
		const { lobbyName, initialState } = req.body;

		if (!lobbyName || !initialState) return res.sendStatus(500);

		// TODO: validation for initialState
		console.log(initialState);
		initSocket(wss, lobbyName, new Lobby(initialState));

		res.json({ created: true }).status(200);
	});

	// app.use(handler);
	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
