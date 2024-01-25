<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import SplashHeader from '$lib/components/layout/splashHeader.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import LobbyInput from '$lib/components/input/lobbyInput.svelte';

	import type { ValidationStatus } from '$lib/types/state';
	import { goto } from '$app/navigation';
	import { username as usernameStore } from '$lib/stores/username';

	let isFetching = false;
	let error: ValidationStatus;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

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
				goto(`lobby/${lobbyName}`);
			}
		} catch (e) {
			error = 'Internal';
		} finally {
			isFetching = false;
		}
	};

	$: usernameStore.set(username ?? '');

	const buttonClass = 'mx-auto mt-1 h-10 w-[97.5%] text-lg';
</script>

<!-- TODO: Make header smaller, increase size of other elements -->
<div class="flex h-full w-full flex-col">
	<SplashHeader class="h-[20%] w-full justify-center" />

	<Separator class="my-5"></Separator>

	<div class="my-2 flex w-full flex-col items-center justify-center">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-3xl font-semibold tracking-tight">Join a Lobby</h1>
			<p class="text-lg text-muted-foreground">Join an existing lobby and get splitting 🪓</p>
		</div>

		<form on:submit={onSubmit} class="w-full">
			<div class="mt-1 flex flex-col justify-center">
				<LobbyInput
					class="flex w-full flex-col space-y-2"
					bind:error
					bind:username
					bind:lobbyName
				/>
				<Button class={buttonClass} type="submit" disabled={isFetching}>Join Lobby</Button>
			</div>
		</form>
	</div>

	<h1 class="mx-auto mb-1 text-2xl tracking-tight">Or</h1>
	<div class="text-center">
		<a href="/create">
			<Button disabled={isFetching} class={buttonClass}>Create Your Own Lobby</Button>
		</a>
	</div>
</div>
