import { Server } from 'socket.io';

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

type LogData =
	| { eventType: 'REQ' | 'RES'; event: string; user?: string; payload?: string; info?: string }
	| { eventType: 'CREATE' | 'DELETE'; lobbyId: string; reason?: string }
	| { eventType: 'CONN' | 'DISC'; lobbyId: string; user?: string; reason?: string };

const log = (params: LogData) => {
	const { eventType = 'REQ', event, lobbyId } = params as any;

	const paramString =
		Object.entries(params).length == 0
			? ''
			: ':' +
				Object.entries(params).reduce((acc, [key, value]) => {
					if (key == 'eventType' || key == 'event' || key == 'lobbyId') return acc;

					acc += `\n\t\t${key} = ${value}`;
					return acc;
				}, '');

	const date = new Date();
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');
	const seconds = `${date.getSeconds()}`.padStart(2, '0');
	const timestamp = `${hours}:${minutes}:${seconds}`;

	let message = `${timestamp} - `;

	if (eventType == 'REQ' || eventType == 'RES') message += `${eventType} on "${event}"`;
	else if (eventType == 'CREATE' || eventType == 'DELETE')
		message += `${eventType} lobby "${lobbyId}"`;
	else if (eventType == 'CONN' || eventType == 'DISC')
		message += `${eventType} on lobby "${lobbyId}"`;

	message += paramString;

	console.log(message);
};

export const LobbyService = (wss: Server) => {
	const lobbyStates: Map<string, lobbyState> = new Map();

	setInterval(() => {
		const now = new Date().getTime();
		for (const [lobbyId, state] of lobbyStates.entries()) {
			if (state.expires < now) {
				lobbyStates.delete(lobbyId);
				log({ eventType: 'DELETE', lobbyId, reason: `Timed out ${now - state.expires}ms ago.` });
			}
		}
	}, 120000);

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
			socket.on('register', (username, callback) => {
				// TODO: Validation on username
				const lobby = lobbyStates.get(lobbyId)!;
				if (!lobby) {
					console.log('COULD NOT FIND LOBBY', lobbyId);
					return;
				}

				if (lobby.users.find((x) => x.name == username)) {
					log({
						eventType: 'REQ',
						event: 'register',
						payload: username,
						info: 'Rejected as username already exists.'
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

				return callback({ status: 'Success' });
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

				lobby.users = [...lobby.users.filter((user) => user.socketId != socket.id)];
			});
		});

		// Set timeout
		wss.of(lobbyId).timeout(timeout).disconnectSockets(true);

		return true;
	};

	return { validateJoin, createLobby };
};
