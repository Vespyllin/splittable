<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import MinimalHeader from '$lib/components/layout/header.svelte';
	import LobbyInput from '$lib/components/lobby/lobbyInput.svelte';
	import ReceiptItemInput from '$lib/components/lobby/itemInput.svelte';

	import { goto } from '$app/navigation';

	import type { ValidationCode, ItemData } from '$lib/types/state';
	import { Plus } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let error: { code: ValidationCode; message?: string } = { code: 'Valid' };

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let data: ItemData[] = [];
	let addDisabled = false;
	let isFetching = false;

	$: {
		if (data.length != 0) {
			const { name, total, quantity, price } = data[0];
			addDisabled = !name || !total || !quantity || !price;
		} else {
			addDisabled = false;
		}
	}

	const onSubmit = async () => {
		isFetching = true;

		const validLobbyRes = await fetch(`http://localhost:2400/validate/${lobbyName}/${username}`);
		const resJSON = await validLobbyRes.json();

		const reason: string = resJSON?.reason.toLowerCase();

		if (!resJSON.ok || !resJSON.sucess) {
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
			return;
		}

		const createRes = await fetch('http://localhost:2400/create_lobby', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ lobbyName, initialState: data })
		});
		const createdJSON = await createRes.json();

		if (!createdJSON.ok || !createdJSON.success) {
			error = { code: 'Internal', message: 'Internal server error. Please try again later.' };

			isFetching = false;
			return;
		}
		goto(`/lobby/?id=${lobbyName}&username=${username}`);
	};
</script>

<div class="flex w-full grow flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	<div class="mb-4 flex w-full flex-col items-center gap-y-2">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">Create a Lobby</h1>
		</div>

		<div class="w-full">
			<LobbyInput class="w-full" bind:error={error.code} bind:username bind:lobbyName />
			<p class={cn('text-center text-sm text-red-600', !error.message && 'hidden')}>
				{error.message}
			</p>
		</div>

		<div class="mt-2 flex w-full items-center">
			<Label class="align-text-bottom text-2xl">Receipt Items</Label>
			<Button
				disabled={addDisabled}
				class="ml-auto h-8 w-12"
				on:click={() => {
					//!!! DO NOT TOUCH !!!
					data = [...data.reverse(), { name: '', total: '', quantity: '', price: '' }].reverse();
				}}
			>
				<Plus />
			</Button>
		</div>

		<div class="h-full w-full">
			{#if data.length == 0}
				<div class="flex items-center px-16 py-2 text-muted-foreground">
					<h1 class="text-lg">🤔 You can't split a bill with no items...</h1>
				</div>
			{/if}
			{#key data.length}
				{#each data as term, idx}
					{#if idx != 0}
						<Separator class="mx-auto my-2 w-[75%]" />
					{/if}

					<ReceiptItemInput bind:item={term} onSubmit={() => (data = data.toSpliced(idx, 1))} />
				{/each}
			{/key}
		</div>
	</div>
	<Button
		class="mx-auto mb-2 mt-auto h-12 w-full text-lg"
		disabled={isFetching || data.length == 0 || addDisabled}
		on:click={onSubmit}>Create Lobby</Button
	>
</div>
