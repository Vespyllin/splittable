export type ValidationStatus = 'NoLobby' | 'BadUsername' | 'Valid' | 'Internal';

export type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

export type ContributionData = ReceiptEntry & {
	contributors: { name: string; contribution: number }[];
};

export type Lobby = {
	contributors: string[];

	entries: ContributionData[];
};
