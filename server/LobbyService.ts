import { Server } from 'socket.io';

type Validation = 'NoLobby' | 'BadUsername' | 'Valid';

type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

type EntryContribution = ReceiptEntry & {
	contributions: { contributorId: string; contribution: number }[];
};

type socketState = {
	expires: number; // Timeout Unix timestamp
	users: { name: string; socketId: string }[];
	state: EntryContribution[];
};

export const LobbyService = (wss: Server) => {
	const lobbies: Map<string, socketState> = new Map();

	const validateJoin = (lobbyName: string, username: string): Validation => {
		const lobby = lobbies.get(lobbyName);

		if (!lobby) return 'NoLobby';

		if (!!lobby.users.find((user) => user.name == username)) return 'BadUsername';

		return 'Valid';
	};

	const createLobby = (
		lobbyName: string,
		initialState: ReceiptEntry[],
		timeout: number = 10 * 60 * 1000
	) => {
		// TODO: Check existing lobby
		console.log('creating', lobbyName);
		const expires = new Date().getTime() + timeout;

		if (lobbies.get(lobbyName)) return false;

		lobbies.set(lobbyName, {
			expires: expires,
			users: [{ name: 'testuser', socketId: '' }],
			state: initialState.map((val) => {
				return { ...val, contributions: [] };
			})
		});

		wss.of(lobbyName).on('connection', (socket) => {
			socket.on('register', (username) => {
				const existingLobby = lobbies.get(lobbyName);
				if (existingLobby) {
					existingLobby.users = [...existingLobby.users, { name: username, socketId: socket.id }];
					lobbies.set(lobbyName, existingLobby);
				}
			});

			socket.on('update', (update) => {
				console.log('HIT ON UPDATE');

				// TODO: update validation
				socket.broadcast.emit('update', update);
			});

			socket.on('disconnect', () => {
				const lobby = lobbies.get(lobbyName);

				if (!lobby) return console.error(`LOBBY ${lobbyName} NOT FOUND ON DISCONNECT`);

				lobby.users = [...lobby.users.filter((user) => user.socketId != socket.id)];
			});
		});

		// Set timeout
		wss.of(lobbyName).timeout(timeout).disconnectSockets(true);

		return true;
	};

	return { validateJoin, createLobby };
};
