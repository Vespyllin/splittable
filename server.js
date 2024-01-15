import { handler } from './build/handler.js';
import express from 'express';
import { Server } from 'socket.io';

// const PORT = process.env.PORT;
const PORT = 5173;

const main = () => {
	const app = express();

	app.get('/healthcheck', (req, res) => {
		res.end('oks');
	});

	app.use(handler);

	const io = new Server(3000, {
		cors: {
			origin: '*'
		}
	});

	io.on('connection', (socket) => {
		socket.emit('messages', "This guy's tutorial sucked so bad omg");
	});

	// const httpServer = http.createServer(app);

	// createSocket(httpServer);

	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
