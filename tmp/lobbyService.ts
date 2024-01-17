import { Server } from 'socket.io';

export const socketService = (wss: Server) => {
	const lobbies: { name: string; id: string; expires: number }[] = [];

	const getLobbyId = (name: string) => {};

	const createLobby = (
		lobbyName: string,
		initialState: Map<string, {}>,
		timeout: number = 10 * 60 * 1000
	) => {
		// Create namespaced socket
		wss.of(lobbyName).on('connection', (socket) => {
			socket.emit('state', initialState.get(lobbyName));
		});

		setHandlers(lobbyName);

		// setInterval(() => {
		// 	wss.of(lobbyName).emit('messages', { userID: 'abc', item: 'item', contribution: 1 / 3 });
		// }, 500);

		// Set timeout
		wss.of(lobbyName).timeout(timeout).disconnectSockets(true);
	};

	const setHandlers = (lobbyName: string) => {
		wss.of(lobbyName).on('update', (message: any) => {
			// TODO: check message format
			wss.of(lobbyName).emit('update', message);
		});
	};

	return { getLobbyId, createLobby };
};
