export type ResPayload =
	| { success: false; reason: string }
	| { success: true; data?: any }
