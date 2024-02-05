type LogData = {
	eventType: 'RECV' | 'SEND' | 'ERR';
	namespace: string;
	event: string;
	payload?: any;
	user?: string;
	info?: string;
};

const log = (
	eventType: 'RECV' | 'SEND' | 'ERR',
	namespace: string,
	event: string,
	payload?: any,
	info?: string
) => {
	const paramString =
		(payload || info) &&
		':' +
			(payload ? `\npayload = ${JSON.stringify(payload)}` : '') +
			(info ? `\ninfo = ${info}` : '');

	const date = new Date();
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');
	const seconds = `${date.getSeconds()}`.padStart(2, '0');
	const timestamp = `${hours}:${minutes}:${seconds}`;

	let message = `${timestamp} - `;

	if (eventType == 'RECV') message += `${eventType} on "${event}" on /${namespace}`;
	else if (eventType == 'SEND') message += `${eventType} from "${event}" on /${namespace}`;
	else message += `${eventType}`;

	message += paramString;

	console.log(message);
};

export default log;
