<script lang="ts">
	import LoveSpiteHeader from '$lib/components/loveSpiteHeader.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import LobbyInput from '$lib/components/lobbyInput.svelte';

	import type { ValidationStatus } from '$lib/types/state';

	import { cn } from '$lib/utils';
	let className: string | undefined | null = undefined;
	export { className as class };

	let isFetching = false;
	let error: ValidationStatus;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	const onSubmit = async (event: any) => {
		isFetching = true;

		try {
			const validLobbyRes = await fetch(
				`http://localhost:2400/valid_join/${lobbyName}/${username}`
			);
			const resJSON = await validLobbyRes.json();

			if (!validLobbyRes.ok || !resJSON.valid) error = 'Internal';
			else error = resJSON.valid;
		} catch (e) {
			error = 'Internal';
		} finally {
			isFetching = false;
		}
	};

	const buttonClass = 'mx-auto mt-1 h-10 w-[97.5%] text-lg';
</script>

<!-- TODO: Make header smaller, increase size of other elements -->
<div class="flex h-full w-full flex-col p-8 pb-2">
	<LoveSpiteHeader class="h-[20%] w-full justify-center " />

	<Separator class="my-5"></Separator>

	<div class={cn('flex w-full flex-col items-center justify-center', className)}>
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-3xl font-semibold tracking-tight">Join a Lobby</h1>
			<p class="text-lg text-muted-foreground">Join an existing lobby and get splitting 🪓</p>
		</div>

		<Separator class="my-2 w-[75%]" />

		<form on:submit={onSubmit} class="w-full">
			<div class="mt-1 flex flex-col justify-center space-y-2">
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

	<div class="my-2 flex-col space-y-2 text-center">
		<h1 class="text-2xl tracking-tight">Or</h1>
		<a href="/create">
			<Button disabled={isFetching} class={buttonClass}>Create Your Own Lobby</Button>
		</a>
	</div>

	<Footer class="mt-auto" />
</div>
