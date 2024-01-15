import { handler } from './build/handler.js';
import express from 'express';

const PORT = process.env.PORT;

const main = () => {
	const app = express();

	app.get('/healthcheck', (req, res) => {
		res.end('oks');
	});

	app.use(handler);

	app.listen(PORT, () => {
		console.log(`Hosting on port ${PORT}`);
	});
};

main();
