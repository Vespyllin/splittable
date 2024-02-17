export type ItemData = { name: string; total: number; quantity: number; price: number };

export type ContributionData = { username: string; amount: number };

export type EntryData = {
	item: ItemData;
	contributions: ContributionData[];
};

export type Lobby = {
	contributors: string[];

	entries: EntryData[];
};
