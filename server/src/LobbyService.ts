import { Server } from 'socket.io';
import log from './log';

type Validation = 'NoLobby' | 'BadUsername' | 'Valid';

type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

type EntryContribution = ReceiptEntry & {
	contributions: { contributorId: string; contribution: number }[];
};

type lobbyState = {
	expires: number; // Timeout Unix timestamp
	users: { name: string; socketId: string }[];
	state: EntryContribution[];
};

export const LobbyService = (wss: Server) => {
	const lobbyStates: Map<string, lobbyState> = new Map();

	// setInterval(() => {
	// 	const now = new Date().getTime();
	// 	for (const [lobbyId, state] of lobbyStates.entries()) {
	// 		if (state.expires < now) {
	// 			lobbyStates.delete(lobbyId);
	// 			log({ eventType: 'DELETE', lobbyId, reason: `Timed out ${now - state.expires}ms ago.` });
	// 		}
	// 	}
	// }, 120000);

	const validateJoin = (lobbyId: string, username: string): Validation => {
		const lobby = lobbyStates.get(lobbyId);

		if (!lobby) return 'NoLobby';
		else if (!!lobby.users.find((user) => user.name == username)) return 'BadUsername';

		return 'Valid';
	};

	const createLobby = (
		lobbyId: string,
		initialState: ReceiptEntry[],
		timeout: number = 10 * 60 * 1000
	) => {
		// TODO: Check existing lobby
		log({ eventType: 'CREATE', lobbyId });
		const expires = new Date().getTime() + timeout;

		if (lobbyStates.get(lobbyId)) return false;

		lobbyStates.set(lobbyId, {
			expires: expires,
			users: [{ name: 'testuser', socketId: '' }],
			state: initialState.map((val) => {
				return { ...val, contributions: [] };
			})
		});

		wss.of(lobbyId).on('connection', (socket) => {
			log({ eventType: 'CONN', lobbyId: lobbyId });

			socket.on('register', (username, callback) => {
				// TODO: Validation on username
				console.log('register');
				const lobby = lobbyStates.get(lobbyId)!;
				if (!lobby) {
					return console.log('COULD NOT FIND LOBBY', lobbyId);
				}

				if (lobby.users.findIndex((x) => x.name == username && x.socketId != socket.id) !== -1) {
					log({
						eventType: 'REQ',
						event: 'register',
						payload: username,
						info: 'Rejected as the username already exists.'
					});

					return callback({ status: 'Failure' });
				} else {
					log({
						eventType: 'REQ',
						event: 'register',
						payload: username
					});

					lobby.users = [...lobby.users, { name: username, socketId: socket.id }];
					lobbyStates.set(lobbyId, lobby);

					return callback({ status: 'Success' });
				}
			});

			socket.on('update', (payload) => {
				const lobby = lobbyStates.get(lobbyId)!;
				const sender = lobby?.users.find((x) => x.socketId == socket.id);

				if (!sender) {
					log({
						eventType: 'REQ',
						event: 'update',
						payload: payload,
						info: 'Rejected as socket is not registered.'
					});
					return socket.emit('bad req');
				}

				// TODO: update validation

				log({
					eventType: 'REQ',
					event: 'update',
					payload: payload,
					user: sender.name
				});
				wss.of(lobbyId).sockets.forEach((clientSocket) => {
					const target = lobby?.users.find((x) => x.socketId == clientSocket.id);

					if (target) {
						log({
							eventType: 'RES',
							event: 'update',
							payload: payload,
							user: target.name
						});
						clientSocket.emit('update', payload);
					}
				});
			});

			socket.on('disconnect', () => {
				const lobby = lobbyStates.get(lobbyId);

				if (!lobby) return console.error(`LOBBY ${lobbyId} NOT FOUND ON DISCONNECT`);

				log({
					eventType: 'DISC',
					lobbyId: lobbyId,
					user: lobby.users.find((user) => user.socketId == socket.id)?.name,
					reason: 'Disconnected Socket' + socket.id + 'User Socket' + JSON.stringify(lobby.users)
				});

				lobby.users = [...lobby.users.filter((user) => user.socketId != socket.id)];
			});
		});

		// Set timeout
		wss.of(lobbyId).timeout(timeout).disconnectSockets(true);

		return true;
	};

	return { validateJoin, createLobby };
};
