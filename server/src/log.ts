const log = (logString: string) => {
	const date = new Date()
	const hours = `${date.getHours()}`.padStart(2, '0')
	const minutes = `${date.getMinutes()}`.padStart(2, '0')
	const seconds = `${date.getSeconds()}`.padStart(2, '0')
	const timestamp = `${hours}:${minutes}:${seconds}`

	console.log(`${timestamp} - ${logString}`)
}

export const wsLog = (
	eventType: 'RES' | 'RECV' | 'SEND' | 'ERR' | 'INFO',
	namespace: string,
	event: string,
	payload?: any,
	info?: string
) => {
	const paramString =
		(payload || info) &&
		':' +
			(payload ? `\npayload = ${JSON.stringify(payload)}` : '') +
			(info ? `\ninfo = ${info}` : '')

	if (eventType == 'RECV' || eventType == 'SEND')
		log(`${eventType} on "${event}" in /${namespace}` + paramString)
	else log(`${eventType}` + paramString)
}

export const serverLog = (
	eventType: 'REQ' | 'INFO',
	endpoint: string,
	reqPayload?: any,
	resPayload?: any,
	info?: string
) => {
	const paramString =
		(reqPayload || resPayload || info) &&
		':' +
			(reqPayload ? `\nRequest Payload = ${JSON.stringify(reqPayload)}` : '') +
			(resPayload ? `\nResponse Payload = ${JSON.stringify(resPayload)}` : '') +
			(info ? `\ninfo = ${info}` : '')

	log(`${eventType} on ${endpoint}` + paramString)
}
