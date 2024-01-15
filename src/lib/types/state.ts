export type ReceiptEntry = { name: string; total: string; quantity: string; price: string };

type Contributor = { username: string; userId: string };

type LobbyEntry = ReceiptEntry & { contributorId: string; contribution: number }[];

export type Lobby = {
	lobbyName: string;
	selfId: string;

	contributors: Contributor[];

	state: LobbyEntry[];
};
