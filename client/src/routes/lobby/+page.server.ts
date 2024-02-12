export function load({ url }) {
	const lobbyId = url.searchParams.get('id');
	const username = url.searchParams.get('username');

	if (!lobbyId || !username) throw Error('Missing Lobby ID or Username query params.');

	return {
		username,
		lobbyId
	};
}

export const prerender = false;
export const ssr = false;
