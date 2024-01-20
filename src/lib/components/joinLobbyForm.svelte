<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import LobbyInput from './lobbyInput.svelte';

	import { cn } from '$lib/utils';
	import type { Error } from '$lib/types/state';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let isFetching = false;

	let error: Error[] = [];

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	const onSubmit = async (event: any) => {
		console.log('joinLobby onSubmit');
		event.target.reset();

		isFetching = true;

		try {
			const validLobbyRes = await fetch(`http://localhost:3000/${lobbyName}/${username}`);
			const resJSON = await validLobbyRes.json();
			if (!validLobbyRes.ok) {
				error = ['Server'];
			} else {
				error = [];
				if (resJSON.lobby) error.push('Lobby');
				if (resJSON.username) error.push('Username');
			}
		} catch (e) {
			error = ['Server'];
		} finally {
			isFetching = false;
		}
	};
</script>

<div class={cn('flex w-full flex-col items-center justify-center', className)}>
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-bold tracking-tight">Join a Lobby</h1>
		<p class="text-sm text-muted-foreground">Join an existing lobby and get splitting 🪓</p>
	</div>

	<Separator class="my-2 w-full " />

	<form on:submit={onSubmit} class="w-full">
		<div class="mt-1 space-y-2">
			<LobbyInput class="flex w-full flex-col space-y-2" bind:error bind:username bind:lobbyName />
			<Button class="mt-1 w-full" type="submit" disabled={isFetching}>Join Lobby</Button>
		</div>
	</form>
</div>
