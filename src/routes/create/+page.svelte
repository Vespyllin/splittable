<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import MinimalHeader from '$lib/components/layout/header.svelte';
	import LobbyInput from '$lib/components/input/lobbyInput.svelte';
	import ReceiptItemInput from '$lib/components/input/receiptItemInput.svelte';

	import { goto } from '$app/navigation';

	import type { ValidationStatus, ReceiptEntry } from '$lib/types/state';
	import { Plus } from 'radix-icons-svelte';

	let error: ValidationStatus;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let data: ReceiptEntry[] = [];
	let addDisabled = false;
	$: {
		if (data.length != 0) {
			const { name, total, quantity, price } = data[0];
			if (!name || !total || !quantity || !price) addDisabled = true;
			else addDisabled = false;
		} else {
			addDisabled = false;
		}
	}

	// TODO: If invalid req, inline style red border and inline a placeholder with the error message
	const onSubmit = async () => {
		console.log('createLobby onSubmit');

		const createRes = await fetch('http://localhost:2400/create_lobby', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ lobbyName, initialState: data })
		});

		if (createRes.ok) {
			const createJson = await createRes.json();
			console.log(createJson);

			if (!!createJson.created) goto(`/lobby/?id=${lobbyName}&username=${username}`);
		}
	};
</script>

<div class="flex w-full grow flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	<div class="mb-4 flex w-full flex-col items-center gap-y-2">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">Create a Lobby</h1>
		</div>

		<LobbyInput class="w-full" bind:error bind:username bind:lobbyName />

		<div class="mt-2 flex w-full items-center">
			<Label class="align-text-bottom text-2xl">Receipt Items</Label>
			{#key addDisabled}
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
			{/key}
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
	<Button class="mx-auto mb-2 mt-auto h-12 w-full text-lg" on:click={onSubmit}>Create Lobby</Button>
</div>
