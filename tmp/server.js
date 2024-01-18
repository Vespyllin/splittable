"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// import { handler } from './build/handler.js';
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// const express = require('express');
// const cors = require('cors');
const LobbyService_1 = require("./LobbyService");
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 2400;
const main = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    const wss = new socket_io_1.Server(3000, { cors: { origin: '*' } });
    const lobbyService = (0, LobbyService_1.LobbyService)(wss);
    app.get('/valid_join/:lobbyName/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { lobbyName, username } = req.params;
        if (!lobbyName || !username)
            return res.sendStatus(400);
        const lobbyRes = lobbyService.validateJoin(lobbyName, username);
        res.json({ valid: lobbyRes }).status(200);
    }));
    app.post('/create_lobby', (req, res) => {
        const { lobbyName, initialState } = req.body;
        if (!lobbyName || !initialState)
            return res.sendStatus(400);
        // TODO: validation for initialState
        const lobbyRes = lobbyService.createLobby(lobbyName, initialState);
        res.json({ valid: lobbyRes }).status(200);
    });
    wss.on('connect', (socket) => {
        socket.emit('HELLO');
    });
    // app.post('/send_lobby', (req, res) => {
    // 	wss.of(req.body.lobbyId).emit('messages', `message ${new Date()}`);
    // 	res.sendStatus(200);
    // });
    wss.on('connection', (socket) => {
        socket.emit('messages', "This guy's tutorial sucked so bad omg");
    });
    lobbyService.createLobby('abc', []);
    // app.use(handler);
    app.listen(PORT, () => {
        console.log(`Hosting on port ${PORT}`);
    });
};
main();
