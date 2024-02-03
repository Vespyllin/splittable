type LogData =
	| { eventType: 'REQ' | 'RES'; event: string; user?: string; payload?: string; info?: string }
	| { eventType: 'CREATE' | 'DELETE'; lobbyId: string; reason?: string }
	| { eventType: 'CONN' | 'DISC'; lobbyId: string; user?: string; reason?: string };

const log = (params: LogData) => {
	const { eventType = 'REQ', event, lobbyId } = params as any;

	const paramString =
		Object.entries(params).length == 0
			? ''
			: ':' +
				Object.entries(params).reduce((acc, [key, value]) => {
					if (key == 'eventType' || key == 'event' || key == 'lobbyId') return acc;

					acc += `\n\t\t${key} = ${JSON.stringify(value)}`;
					return acc;
				}, '');

	const date = new Date();
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');
	const seconds = `${date.getSeconds()}`.padStart(2, '0');
	const timestamp = `${hours}:${minutes}:${seconds}`;

	let message = `${timestamp} - `;

	if (eventType == 'REQ' || eventType == 'RES') message += `${eventType} on "${event}"`;
	else if (eventType == 'CREATE' || eventType == 'DELETE')
		message += `${eventType} lobby "${lobbyId}"`;
	else if (eventType == 'CONN' || eventType == 'DISC')
		message += `${eventType} on lobby "${lobbyId}"`;

	message += paramString;

	console.log(message);
};

export default log;
