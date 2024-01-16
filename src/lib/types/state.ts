export type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

export type Entry = ReceiptEntry & {
	contributors: { contributorId: string; contribution: number }[];
};

export type Lobby = {
	selfId: string;

	contributors: string[];

	entries: Entry[];
};
