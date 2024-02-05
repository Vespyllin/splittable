import { Server } from 'socket.io';
import { Lobby } from './Lobby';
import log from './log';

export default (wss: Server, namespace: string, lobby: Lobby, ttl: number) => {
	const namespacedConnection = wss.of(namespace);

	setTimeout(() => {
		console.log(`Shutting down namespace ${namespace}.`);
		namespacedConnection.disconnectSockets(true);
		namespacedConnection.removeAllListeners();
		// wss._nsps.delete(namespace);
	}, ttl);

	namespacedConnection.on('connection', (socket) => {
		log('RECV', namespace, 'connection');

		socket.on('register', (payload, callback) => {
			const username = payload;
			log('RECV', namespace, 'register', username, username);

			const registeredUser = lobby.getUserByUsername(username);

			if (registeredUser && registeredUser.socketId != socket.id) {
				log(
					'SEND',
					namespace,
					'register',
					payload,
					`Rejected as "${username}" is registered on a different socket.`
				);
				return callback({ status: 'Failure' });
			}

			lobby.addUser({ username: username, socketId: socket.id });
			const state = lobby.getState();
			const response = { entries: state.entries, contributors: state.users.map((x) => x.username) };

			log('SEND', namespace, 'register', response, username);
			callback({ status: 'Success', data: response });

			log('SEND', namespace, 'join', username, `Sent to "registered" room.`);
			namespacedConnection.to('registered').emit('join', username);

			socket.join('registered');
		});

		socket.on('update', async (payload) => {
			if (!lobby.getUserBySocket(socket.id))
				return log(
					'RECV',
					namespace,
					'update',
					payload,
					'Rejected message as socket is not registered.'
				);

			log('RECV', namespace, 'update', payload);

			// TODO: Validation
			const { username, itemName, amount } = payload;
			lobby.upsertContribution(username, itemName, amount);

			log('SEND', namespace, 'update', payload, `Sent to "registered" room.`);
			namespacedConnection.to('registered').emit('update', payload);
		});

		socket.on('disconnect', () => {
			const leaverName = lobby.getUserBySocket(socket.id)?.username;

			if (!leaverName) return log('RECV', namespace, 'disconnect', `Anon user disconnected.`);

			log('RECV', namespace, 'disconnect', `User ${leaverName} disconnected.`);
			socket.leave('registered');

			if (!lobby.removeUser(leaverName))
				return log(
					'ERR',
					namespace,
					'disconnect',
					`User ${leaverName} disconnected but not found in state.`
				);

			log('SEND', namespace, 'leave', leaverName, `Sent to "registered" room.`);
			namespacedConnection.to('registered').emit('leave', leaverName);
		});
	});
};
