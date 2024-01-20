<script lang="ts">
	import JoinLobbyForm from '$lib/components/joinLobbyForm.svelte';
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
</script>

<!-- TODO: Make header smaller, increase size of other elements -->
<div class="flex h-full w-full flex-col p-8">
	<LoveSpiteHeader class="mb-10 mt-5 h-[20%] w-full justify-center " />

	<div class={cn('flex w-full flex-col items-center justify-center', className)}>
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-3xl font-semibold tracking-tight">Join a Lobby</h1>
			<p class="text-lg text-muted-foreground">Join an existing lobby and get splitting 🪓</p>
		</div>

		<Separator class="my-2 w-full " />

		<form on:submit={onSubmit} class="w-full">
			<div class="mt-1 space-y-2">
				<LobbyInput
					class="flex w-full flex-col space-y-2"
					bind:error
					bind:username
					bind:lobbyName
				/>
				<Button
					class="mx-auto mt-1 h-auto w-full text-lg font-semibold"
					type="submit"
					disabled={isFetching}
				>
					Join Lobby
				</Button>
			</div>
		</form>
	</div>

	<div class="my-2 flex-col space-y-2 text-center">
		<h1 class="text-2xl tracking-tight">Or</h1>
	</div>
	<a href="/create">
		<Button disabled={isFetching} class="mx-auto mt-1 h-auto w-full text-lg font-semibold"
			>Create Your Own Lobby</Button
		>
	</a>

	<Footer />
</div>
