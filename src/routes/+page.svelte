<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SplashHeader from '$lib/components/layout/splashHeader.svelte';
	import LobbyInput from '$lib/components/lobby/lobbyInput.svelte';

	import type { ValidationCode } from '$lib/types/state';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';

	let isFetching = false;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let error: { code: ValidationCode; message?: string } = { code: 'Valid' };

	const onSubmit = async () => {
		isFetching = true;

		const validLobbyRes = await fetch(`http://localhost:2400/validate/${lobbyName}/${username}`);
		const resJSON = await validLobbyRes.json();

		if (resJSON.ok && resJSON.sucess) return goto(`lobby/?id=${lobbyName}&username=${username}`);

		const reason: string = resJSON?.reason.toLowerCase();

		if (!reason) {
			error = { code: 'Internal', message: 'Internal server error. Please try again later.' };
		} else if (reason == 'bad request') {
			error = { code: 'Valid', message: '' };
		} else if (reason.includes('username')) {
			error = {
				code: 'Username',
				message: `Username "${username}" is not available in lobby ${lobbyName}.`
			};
		} else if (reason.includes('lobby')) {
			error = { code: 'Lobby', message: `Could not find lobby "${lobbyName}".` };
		}

		isFetching = false;
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

		<div class="mt-1 flex w-full flex-col space-y-2">
			<LobbyInput
				class="flex w-full flex-col space-y-2"
				bind:error={error.code}
				bind:username
				bind:lobbyName
			/>
			<p class={cn('text-center text-sm text-red-600', !error.message && 'hidden')}>
				{error.message}
			</p>
			<Button class="mx-auto  h-10 w-[97.5%] text-lg" on:click={onSubmit} disabled={isFetching}>
				Join Lobby
			</Button>
		</div>
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
