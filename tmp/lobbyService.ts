import { Namespace, Server } from 'socket.io';

type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

type EntryContribution = ReceiptEntry & {
	contributions: { contributorId: string; contribution: number }[];
};

type socketState = {
	expires: number; // Timeout Unix timestamp
	users: string[];
	state: EntryContribution[];
};

export const LobbyService = (wss: Server) => {
	const lobbies: Map<string, socketState> = new Map();

	const validateJoin = (lobbyName: string, username: string) => {
		const lobby = lobbies.get(lobbyName);
		if (!lobby) return false;

		return !lobby.users.find((existingUsername) => existingUsername == username);
	};

	const createLobby = (
		lobbyName: string,
		initialState: ReceiptEntry[],
		timeout: number = 10 * 60 * 1000
	) => {
		// TODO: Check existing lobby
		console.log('creating', lobbyName);
		const expires = new Date().getTime() + timeout;

		lobbies.set(lobbyName, {
			expires: expires,
			users: [],
			state: initialState.map((val) => {
				return { ...val, contributions: [] };
			})
		});

		wss.of(lobbyName).on('connection', (socket) => {
			socket.on('register', (username) => {
				const existingLobby = lobbies.get(lobbyName);
				if (existingLobby) {
					existingLobby.users = [...existingLobby.users, username];
					lobbies.set(lobbyName, existingLobby);
				}
			});

			socket.on('update', (update) => {
				console.log('HIT ON UPDATE');

				// TODO: update validation
				socket.broadcast.emit('update', update);
			});

			socket.on('disconnect', () => {
				console.log(`User ${lobbies.get(lobbyName)}`);
			});
		});

		// Set timeout
		wss.of(lobbyName).timeout(timeout).disconnectSockets(true);

		return true;
	};

	return { validateJoin, createLobby };
};
