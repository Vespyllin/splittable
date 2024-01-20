export type ValidationStatus = 'NoLobby' | 'BadUsername' | 'Valid' | 'Internal';

export type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

export type ContributionEntry = ReceiptEntry & {
	contributors: { contributorId: string; contribution: number }[];
};

export type Lobby = {
	selfId: string;

	contributors: string[];

	entries: ContributionEntry[];
};
