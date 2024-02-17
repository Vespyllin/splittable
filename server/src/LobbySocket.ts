import { Server } from 'socket.io'
import { Lobby } from './Lobby'
import { wsLog } from './log'
import { SafeParseReturnType, z } from 'zod'
import { UpdatePayload } from './types/socket'

export class LobbySocket {
	private wss: Server
	private namespace: string
	private lobby: Lobby
	private ttl: number
	private startTime: number

	private registerSchema
	private updateSchema

	constructor(wss: Server, namespace: string, lobby: Lobby, ttl: number) {
		this.wss = wss
		this.namespace = namespace
		this.lobby = lobby
		this.ttl = ttl
		this.startTime = new Date().getTime()
		this.registerSchema = z.string()
		this.updateSchema = z.object({
			username: z.string(),
			itemName: z.string(),
			amount: z.coerce.number()
		})
	}

	start(): void {
		this.wss.of(this.namespace).on('connection', (socket) => {
			wsLog('RECV', this.namespace, 'connection')

			socket.on('register', (payload, callback) => {
				wsLog('RECV', this.namespace, 'register', payload)

				const parsedPayload = this.registerSchema.safeParse(payload)
				if (!parsedPayload.success) {
					wsLog('SEND', this.namespace, 'register', payload, 'Invalid payload')
					return callback({ status: 'Failure' })
				}

				const username = parsedPayload.data

				const registeredUser = this.lobby.getUserByUsername(username)
				if (registeredUser && registeredUser.socketId != socket.id) {
					wsLog(
						'SEND',
						this.namespace,
						'register',
						payload,
						`Rejected as "${username}" is registered on a different socket.`
					)
					return callback({ status: 'Failure' })
				}

				this.lobby.addUser({ username: username, socketId: socket.id })
				const state = this.lobby.getState()
				const response = {
					entries: state.entries,
					contributors: state.users.map((x) => x.username)
				}

				wsLog('SEND', this.namespace, 'register', response, username)
				callback({ status: 'Success', data: response })

				wsLog('SEND', this.namespace, 'join', username, `Sent to "registered" room.`)
				this.wss.of(this.namespace).to('registered').emit('join', username)

				socket.join('registered')
			})

			socket.on('update', async (payload) => {
				wsLog('RECV', this.namespace, 'update', payload)

				if (!this.lobby.getUserBySocket(socket.id)) {
					return wsLog(
						'RECV',
						this.namespace,
						'update',
						payload,
						'Rejected message as socket is not registered.'
					)
				}

				const parsedPayload: SafeParseReturnType<UpdatePayload, UpdatePayload> =
					this.updateSchema.safeParse(payload)

				if (!parsedPayload.success) {
					return wsLog(
						'RECV',
						this.namespace,
						'update',
						payload,
						'Rejected message as it was malformed.'
					)
				}

				const { username, itemName, amount } = parsedPayload.data

				this.lobby.upsertContribution(username, itemName, amount)

				wsLog('SEND', this.namespace, 'update', payload, `Sent to "registered" room.`)
				this.wss.of(this.namespace).to('registered').emit('update', payload)
			})

			socket.on('disconnect', () => {
				const leaverName = this.lobby.getUserBySocket(socket.id)?.username

				if (!leaverName) {
					return wsLog('RECV', this.namespace, 'disconnect', `Anon user disconnected.`)
				}

				wsLog('RECV', this.namespace, 'disconnect', `User ${leaverName} disconnected.`)
				socket.leave('registered')

				if (!this.lobby.removeUser(leaverName))
					return wsLog(
						'ERR',
						this.namespace,
						'disconnect',
						`User ${leaverName} disconnected but not found in state.`
					)

				wsLog('SEND', this.namespace, 'leave', leaverName, `Sent to "registered" room.`)
				this.wss.of(this.namespace).to('registered').emit('leave', leaverName)
			})
		})
	}

	isAlive(): boolean {
		const currentTime = new Date().getTime()
		const normalExpire = this.startTime + this.ttl < currentTime
		const hardExpire =
			this.lobby.getAllUsers().length == 0 && this.startTime + this.ttl / 2 < currentTime

		return !normalExpire || !hardExpire
	}

	getNamespace(): string {
		return this.namespace
	}

	getState(): Lobby {
		return this.lobby
	}

	close(): void {
		wsLog('INFO', 'Internal', 'Shudown', undefined, `Shutting down namespace ${this.namespace}.`)
		this.wss.of(this.namespace).disconnectSockets(true)
		this.wss.of(this.namespace).removeAllListeners()
	}
}
