type LogData = {
	eventType: 'RECV' | 'SEND' | 'ERR';
	namespace: string;
	event: string;
	payload?: any;
	user?: string;
	info?: string;
};

const log = (params: LogData) => {
	const { eventType, event, namespace } = params;

	const paramString =
		Object.entries(params).length == 0
			? ''
			: ':' +
				Object.entries(params).reduce((acc: string, [key, value]) => {
					if (key == 'eventType' || key == 'event' || key == 'namespace') return acc;

					const formattedValue = typeof value == 'object' ? JSON.stringify(value, null, 2) : value;
					acc += `\n${key} = ${formattedValue}`;
					return acc;
				}, '');

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
