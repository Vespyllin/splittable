import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

import { Lobby } from './Lobby'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { serverLog } from './log'
import { ResPayload } from './types/server'
import { LobbySocket } from './LobbySocket'

const SERVER_PORT = 3388
const SOCKET_PORT = 4430

const main = () => {
	const app = express()

	app.use(express.json())
	app.use(cors())
	app.use(helmet())
	app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 25 }))

	let activeLobbies: LobbySocket[] = []
	setInterval(() => {
		let closedLobbyNames: string[] = []

		let closedLobbies = activeLobbies.filter((x) => !x.isAlive())
		activeLobbies = activeLobbies.filter((x) => x.isAlive())

		closedLobbies.forEach((x) => x.close())
		if (closedLobbies.length > 0)
			serverLog(
				'INFO',
				'Internal',
				undefined,
				undefined,
				`Pruned ${
					closedLobbyNames.length
				} lobbies:\n${closedLobbyNames.toString()}`
			)
	}, 1000)

	const wss = new Server(SOCKET_PORT, { cors: { origin: '*' } })
	const ttl = 60 * 1000 * 30 // 30 minutes

	app.get('/exists/:lobby_name/:username?', (req, res) => {
		const { lobby_name: lobbyName, username } = req.params

		if (!lobbyName) {
			const resPayload: ResPayload = { success: false, reason: 'Bad Request' }
			serverLog('REQ', '/exists', req.params, resPayload)
			return res.json(resPayload).status(400)
		}

		const foundLobby = activeLobbies.find((x) => x.getNamespace() == lobbyName)
		const lobbyExists = !!foundLobby
		const usernameExists = !username
			? undefined
			: lobbyExists && !!foundLobby?.getState().getUserByUsername(username)

		const resPayload: ResPayload = {
			success: true,
			data: { lobby: lobbyExists, username: usernameExists },
		}
		serverLog('REQ', '/exists', req.params, resPayload)
		return res.json(resPayload).status(200)
	})

	app.post('/create_lobby', (req, res) => {
		const { lobby_name: lobbyName, initial_state: initialState } = req.body

		if (!lobbyName || !initialState) {
			const resPayload: ResPayload = { success: false, reason: 'Bad request' }
			serverLog('REQ', '/create_lobby', { lobbyName, initialState }, resPayload)
			return res.json(resPayload).status(400)
		}

		// TODO: ZOD Payload Validation and Parsing

		if (activeLobbies.find((x) => x.getNamespace() == lobbyName)) {
			const resPayload: ResPayload = {
				success: false,
				reason: 'Lobby already exists',
			}
			serverLog('REQ', '/create_lobby', { lobbyName, initialState }, resPayload)
			return res.json(resPayload).status(400)
		}

		const lobby = new Lobby(initialState)
		const lobbySocket = new LobbySocket(wss, lobbyName, lobby, ttl)
		lobbySocket.start()

		activeLobbies.push(lobbySocket)

		const resPayload: ResPayload = { success: true }
		serverLog('REQ', '/create_lobby', { lobbyName, initialState }, resPayload)
		res.json(resPayload).status(200)
	})

	app.listen(SERVER_PORT, () => {
		console.log(`Hosting on port ${SERVER_PORT}`)
	})
}

main()
