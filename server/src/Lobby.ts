import { LobbyState, ItemData, SocketUser } from './types/state'

export class Lobby {
	private state: LobbyState

	constructor(initialState: ItemData[] = []) {
		this.state = {
			users: [],
			entries: initialState.map((x) => {
				return { item: x, contributions: [] }
			})
		}
	}

	getAllUsers(): SocketUser[] {
		return JSON.parse(JSON.stringify(this.state.users))
	}

	addUser(user: SocketUser): void {
		this.state.users.push(user)
	}

	removeUser(username: string): boolean {
		if (
			!this.state.users.find((x) => x.username == username) &&
			!this.state.entries.reduce((acc, x) => {
				const hasUser = x.contributions.reduce((acc, x) => {
					return acc || x.username == username
				}, false)

				return acc || hasUser
			}, false)
		)
			return false

		this.state.users = [...this.state.users.filter((user) => user.username != username)]
		this.state.entries = this.state.entries.map((entry) => {
			entry.contributions = entry.contributions.filter(
				(contribution) => contribution.username != username
			)
			return entry
		})

		return true
	}

	getUserBySocket(socketId: string): SocketUser | undefined {
		return this.state.users.find((x) => x.socketId == socketId)
	}
	getUserByUsername(username: string): SocketUser | undefined {
		return this.state.users.find((x) => x.username == username)
	}

	upsertContribution(username: string, itemName: string, amount: number): boolean {
		if (!this.state.users.find((x) => x.username == username)) return false
		const entryIdx = this.state.entries.findIndex((x) => x.item.name == itemName)
		if (entryIdx == -1) return false

		const contributionIdx = this.state.entries[entryIdx].contributions.findIndex(
			(x) => x.username == username
		)

		if (contributionIdx == -1 && amount != 0) {
			this.state.entries[entryIdx].contributions.push({ username, amount })
		} else if (contributionIdx != -1) {
			if (amount != 0) {
				this.state.entries[entryIdx].contributions[contributionIdx].amount = amount
			} else {
				this.state.entries[entryIdx].contributions.splice(contributionIdx, 1)
			}
		}

		return true
	}

	getState(): LobbyState {
		return JSON.parse(JSON.stringify(this.state))
	}
}
