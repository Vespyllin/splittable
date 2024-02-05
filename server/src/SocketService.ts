import { Server } from 'socket.io';
import { Lobby } from './Lobby';
import log from './log';

export default (wss: Server, namespace: string, lobby: Lobby, ttl: number = 60 * 1000 * 10) => {
	wss.of(namespace).timeout(ttl).disconnectSockets(true);

	wss.of(namespace).on('connection', (socket) => {
		log({ eventType: 'RECV', namespace: namespace, event: 'connection' });

		socket.on('register', (payload, callback) => {
			const username = payload;
			log({
				eventType: 'RECV',
				namespace: namespace,
				event: 'register',
				payload: username,
				user: username
			});

			const registeredUser = lobby.getUserByUsername(username);
			if (registeredUser && registeredUser.socketId != socket.id) {
				log({
					eventType: 'SEND',
					namespace: namespace,
					event: 'register',
					payload: registeredUser,
					info: `Rejected as username "${username}" is already registered on a different socket.`
				});
				return callback({ status: 'Failure' });
			}

			lobby.addUser({ username: username, socketId: socket.id });
			const state = lobby.getState();
			const response = { entries: state.entries, contributors: state.users.map((x) => x.username) };
			log({
				eventType: 'SEND',
				namespace: namespace,
				event: 'register',
				payload: response,
				user: username
			});
			callback({ status: 'Success', data: response });

			wss.of(namespace).sockets.forEach((clientSocket) => {
				if (clientSocket.id == socket.id) return;
				const receipient = lobby.getUserBySocket(clientSocket.id);
				if (!receipient) return;

				log({
					eventType: 'SEND',
					namespace: namespace,
					event: 'join',
					payload: username,
					info: `Sent to ${receipient.username}.`
				});

				clientSocket.emit('join', username);
			});
		});

		socket.on('update', (payload) => {
			if (!lobby.getUserBySocket(socket.id))
				return log({
					eventType: 'RECV',
					namespace: namespace,
					event: 'update',
					payload: payload,
					info: 'Rejected message as socket is not registered.'
				});

			log({
				eventType: 'RECV',
				namespace: namespace,
				event: 'update',
				payload: payload
			});

			// TODO: Validation
			const { username, itemName, amount } = payload;
			lobby.upsertContribution(username, itemName, amount);

			wss.of(namespace).sockets.forEach((clientSocket) => {
				const receipient = lobby.getUserBySocket(clientSocket.id);
				if (!receipient) return;

				log({
					eventType: 'SEND',
					namespace: namespace,
					event: 'update',
					payload: payload,
					info: `Sent to ${receipient.username}.`
				});
				clientSocket.emit('update', payload);
			});
		});

		socket.on('disconnect', () => {
			const leaverName = lobby.getUserBySocket(socket.id)?.username;

			if (!leaverName) {
				return log({
					eventType: 'RECV',
					namespace: namespace,
					event: 'disconnect',
					info: `Anon user disconnected.`
				});
			}

			log({
				eventType: 'RECV',
				namespace: namespace,
				event: 'disconnect',
				info: `User ${leaverName} disconnected.`
			});

			if (!lobby.removeUser(leaverName)) {
				return log({
					eventType: 'ERR',
					namespace: namespace,
					event: 'disconnect',
					info: `User ${leaverName} disconnected but not found in state.`
				});
			}

			wss.of(namespace).sockets.forEach((clientSocket) => {
				const receipient = lobby.getUserBySocket(clientSocket.id);
				if (!receipient) return;

				log({
					eventType: 'SEND',
					namespace: namespace,
					event: 'leave',
					payload: leaverName,
					info: `Sent to ${receipient.username}.`
				});
				clientSocket.emit('leave', leaverName);
			});
		});
	});
};
