export type ValidationCode = 'Lobby' | 'Username' | 'Valid' | 'Internal';

export type Error = { code: ValidationCode; message?: string };

export type UpdatePayload = { username: string; itemName: string; amount: number };
