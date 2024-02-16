export type ResPayload =
	| { success: false; reason: string }
	| { success: true; data?: any }

export type CreatePayload = {
	name: string
	total: string
	quantity: string
	price: string
}
