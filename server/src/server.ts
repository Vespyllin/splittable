import { Server } from 'socket.io';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { LobbyService } from './LobbyService';

// import { handler } from './build/handler.js';
// const express = require('express');
// const cors = require('cors');

const PORT = process.env.PORT ?? 2400;

const main = () => {
	const app = express();
	app.use(express.json());
	app.use(cors());

	const wss = new Server(3000, { cors: { origin: '*' } });
	const lobbyService = LobbyService(wss);

	app.get('/validate_join/:lobbyName/:username', async (req, res: Response) => {
		const { lobbyName, username } = req.params;

		return res
			.json({
				valid: lobbyService.validateJoin(lobbyName, username)
			})
			.status(200);
	});

	app.post('/create_lobby', (req, res) => {
		const { lobbyName, initialState } = req.body;

		if (!lobbyName || !initialState) return res.sendStatus(500);

		// TODO: validation for initialState
		const lobbyRes = lobbyService.createLobby(lobbyName, initialState);

		res.json({ created: lobbyRes }).status(200);
	});

	lobbyService.createLobby('abc', []);

	// app.use(handler);
	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
