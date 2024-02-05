type Validation = 'NoLobby' | 'BadUsername' | 'Valid';

export type SocketUser = { username: string; socketId: string };

export type ItemData = { name: string; total: string; quantity: string; price: string };

export type ContributionData = { username: string; amount: number };

export type EntryData = {
	item: ItemData;
	contributions: ContributionData[];
};

export type LobbyState = {
	users: SocketUser[];
	entries: EntryData[];
};
