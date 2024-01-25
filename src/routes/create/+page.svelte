<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import LobbyInput from '$lib/components/input/lobbyInput.svelte';
	import ReceiptItemInput from '$lib/components/input/receiptItemInput.svelte';

	import type { ValidationStatus, ReceiptEntry } from '$lib/types/state';
	import { goto } from '$app/navigation';

	let error: ValidationStatus;

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

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

			if (!!createJson.created) goto(`/lobby/${lobbyName}`);
		}
	};

	let data: ReceiptEntry[] = [];
</script>

<div class="flex h-full w-full flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	<div class={'flex w-full grow flex-col items-center'}>
		<div class="mb-2 flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">Create a Lobby</h1>
		</div>

		<LobbyInput class="w-full" bind:error bind:username bind:lobbyName />

		<div class="mb-3 mt-5 flex w-full items-center">
			<Label class="align-text-bottom text-2xl">Receipt Items</Label>
			{#key addDisabled}
				<Button
					disabled={addDisabled}
					class="ml-auto h-8 w-12"
					on:click={() => {
						//!!! DO NOT TOUCH !!!
						data = [...data.reverse(), { name: ``, total: '', quantity: '', price: '' }].reverse();
					}}
				>
					+
				</Button>
			{/key}
		</div>

		<div class="w-full grow">
			<div>
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
	</div>
	<div class="left-0 mb-2 mt-4 flex h-fit w-full justify-center">
		<Button class="h-12 w-full text-lg" on:click={onSubmit}>Create Lobby</Button>
	</div>
</div>
