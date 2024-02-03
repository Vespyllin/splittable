<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SplashHeader from '$lib/components/layout/splashHeader.svelte';
	import LobbyInput from '$lib/components/lobby/lobbyInput.svelte';

	import type { ValidationStatus } from '$lib/types/state';
	import { goto } from '$app/navigation';

	let isFetching = false;
	let error: ValidationStatus;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let errorMessage = '';
	$: errorMessage = (() => {
		if (!error || error === 'Valid') return '';

		if (error === 'NoLobby') return 'Could not find specified lobby.';
		else if (error === 'BadUsername') return `Username not available in lobby.`;

		return 'Server is not responding. Please try again later.';
	})();

	const onSubmit = async (event: any) => {
		isFetching = true;

		try {
			const validLobbyRes = await fetch(
				`http://localhost:2400/validate_join/${lobbyName}/${username}`
			);
			const resJSON = await validLobbyRes.json();

			if (!validLobbyRes.ok || !resJSON.valid) error = 'Internal';
			else error = resJSON.valid;

			if (resJSON.valid == 'Valid') {
				goto(`lobby/?id=${lobbyName}&username=${username}`);
			}
		} catch (e) {
			error = 'Internal';
		} finally {
			isFetching = false;
		}
	};
</script>

<div class="flex h-full w-full flex-col">
	<SplashHeader class="h-[20%] w-full justify-center" />

	<Separator class="my-5"></Separator>

	<div class="my-2 flex w-full flex-col items-center justify-center">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-3xl font-semibold tracking-tight">Join a Lobby</h1>
			<p class="text-lg text-muted-foreground">Join an existing lobby and get splitting 🪓</p>
		</div>

		<form on:submit={onSubmit} class="mt-1 w-full space-y-1">
			<LobbyInput class="flex w-full flex-col space-y-2" bind:error bind:username bind:lobbyName />
			<p class="text-sm text-red-600">{`${errorMessage}`}</p>
			<Button class="mx-auto  h-10 w-[97.5%] text-lg" type="submit" disabled={isFetching}
				>Join Lobby</Button
			>
		</form>
	</div>

	<h1 class="mx-auto mb-1 text-2xl tracking-tight">Or</h1>
	<div class="text-center">
		<a href="/create">
			<Button disabled={isFetching} class="mx-auto mt-1 h-10 w-[97.5%] text-lg"
				>Create Your Own Lobby</Button
			>
		</a>
	</div>
</div>
