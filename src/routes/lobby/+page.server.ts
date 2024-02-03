export function load({ url }) {
	const lobbyId = url.searchParams.get('id');
	const username = url.searchParams.get('username');

	if (!lobbyId || !username) throw Error('load fn');

	return {
		username,
		lobbyId
	};
}

export const prerender = false;
