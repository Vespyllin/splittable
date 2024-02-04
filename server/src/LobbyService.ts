import { Server } from 'socket.io';
import log from './log';

type Validation = 'NoLobby' | 'BadUsername' | 'Valid';

type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

type ContributionData = ReceiptEntry & {
	contributions: { name: string; amount: number }[];
};

type lobbyState = {
	expires: number; // Timeout Unix timestamp
	users: { name: string; socketId: string }[];
	entries: ContributionData[];
};

export const LobbyService = (wss: Server) => {
	const lobbyStates: Map<string, lobbyState> = new Map();

	// setInterval(() => {
	// 	const now = new Date().getTime();
	// 	for (const [lobbyId, state] of lobbyStates.entries()) {
	// 		if (state.expires < now) {
	// 			lobbyStates.delete(lobbyId);
	// 			log({ eventType: 'DELETE', lobbyId, info: `Timed out ${now - state.expires}ms ago.` });
	// 		}
	// 	}
	// }, 120000);

	const validateJoin = (lobbyId: string, username: string): Validation => {
		const lobby = lobbyStates.get(lobbyId);

		if (!lobby) return 'NoLobby';
		else if (!!lobby.users.find((user) => user.name == username)) return 'BadUsername';

		return 'Valid';
	};

	const updateState = (lobbyId: string) => {};

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
			entries: initialState.map((val) => {
				return { ...val, contributions: [] };
			})
		});

		wss.of(lobbyId).on('connection', (socket) => {
			log({ eventType: 'CONN', lobbyId: lobbyId });

			socket.on('register', (username, callback) => {
				const lobby = lobbyStates.get(lobbyId);
				if (!lobby)
					return log({ eventType: 'ERR', info: `Could not find lobby ${lobbyId} on "register"` });

				if (lobby.users.findIndex((x) => x.name == username && x.socketId != socket.id) !== -1) {
					log({
						eventType: 'REQ',
						event: 'register',
						payload: username,
						info: 'Rejected as the username already exists.'
					});

					return callback({ status: 'Failure' });
				}

				log({
					eventType: 'REQ',
					event: 'register',
					payload: username
				});

				lobby.users = [...lobby.users, { name: username, socketId: socket.id }];
				lobbyStates.set(lobbyId, lobby);

				log({
					eventType: 'RES',
					event: 'register',
					payload: lobby.entries
				});

				return callback({
					status: 'Success',
					contributors: lobby.users.map((x) => x.name),
					entries: lobby.entries
				});
			});

			socket.on('update', (payload: { username: string; amount: number; itemName: string }) => {
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

				log({
					eventType: 'REQ',
					event: 'update',
					payload: payload,
					user: sender.name
				});

				const { itemName, username, amount } = payload;

				// TODO: validation
				// TODO: Update server state for future register requests
				const entryIdx = lobby.entries.findIndex((x) => {
					return x.name == payload.itemName;
				});

				if (entryIdx === -1) return console.log(`Could not find ${itemName} in state.`);

				const contributionIdx = lobby.entries[entryIdx].contributions.findIndex(
					(x) => x.name == username
				);

				if (contributionIdx !== -1) {
					console.log('contribution found for user');
					lobby.entries[entryIdx].contributions[contributionIdx].amount = amount;
				} else {
					console.log('contribution not found for user');
					lobby.entries[entryIdx].contributions.push({
						name: username,
						amount: amount ?? 1234
					});
				}

				console.log(lobby);

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
					info: 'Disconnected Socket' + socket.id + 'User Socket' + JSON.stringify(lobby.users)
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
