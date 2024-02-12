export type ValidationCode = 'Lobby' | 'Username' | 'Valid' | 'Internal';

export type ItemData = { name: string; total: string; quantity: string; price: string };

export type ContributionData = { username: string; amount: number };

export type EntryData = {
	item: ItemData;
	contributions: ContributionData[];
};

export type Lobby = {
	contributors: string[];

	entries: EntryData[];
};
