"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyService = void 0;
const LobbyService = (wss) => {
    const lobbies = new Map();
    const validateJoin = (lobbyName, username) => {
        const lobby = lobbies.get(lobbyName);
        if (!lobby)
            return 'NoLobby';
        if (!!lobby.users.find((user) => user.name == username))
            return 'BadUsername';
        return 'Valid';
    };
    const createLobby = (lobbyName, initialState, timeout = 10 * 60 * 1000) => {
        // TODO: Check existing lobby
        console.log('creating', lobbyName);
        const expires = new Date().getTime() + timeout;
        if (lobbies.get(lobbyName))
            return false;
        lobbies.set(lobbyName, {
            expires: expires,
            users: [{ name: 'testuser', socketId: '' }],
            state: initialState.map((val) => {
                return Object.assign(Object.assign({}, val), { contributions: [] });
            })
        });
        wss.of(lobbyName).on('connection', (socket) => {
            socket.on('register', (username, callback) => {
                console.log('register', username);
                const existingLobby = lobbies.get(lobbyName);
                if (existingLobby) {
                    existingLobby.users = [...existingLobby.users, { name: username, socketId: socket.id }];
                    lobbies.set(lobbyName, existingLobby);
                }
                callback({ status: 'Success' });
                return null;
            });
            socket.on('update', (update) => {
                console.log('HIT ON UPDATE');
                // TODO: update validation
                socket.broadcast.emit('update', update);
            });
            socket.on('disconnect', () => {
                const lobby = lobbies.get(lobbyName);
                if (!lobby)
                    return console.error(`LOBBY ${lobbyName} NOT FOUND ON DISCONNECT`);
                lobby.users = [...lobby.users.filter((user) => user.socketId != socket.id)];
            });
        });
        // Set timeout
        wss.of(lobbyName).timeout(timeout).disconnectSockets(true);
        return true;
    };
    return { validateJoin, createLobby };
};
exports.LobbyService = LobbyService;
