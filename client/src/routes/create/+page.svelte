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
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	let error: { code: ValidationCode; message?: string } = { code: 'Valid' };

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let data: ItemData[] = [];
	let addDisabled = false;
	let createDisabled = true;
	let isFetching = false;

	$: if (data.length != 0) {
		const { name, total, quantity, price } = data[0];
		addDisabled = !name || !total || !quantity || !price;
	} else {
		addDisabled = false;
	}

	$: createDisabled = isFetching || data.length == 0 || addDisabled || !username || !lobbyName;

	const onSubmit = async () => {
		isFetching = true;

		try {
			const existsRes = await fetch(`${PUBLIC_API_ENDPOINT}/exists/${lobbyName}`);
			const exists: { success: boolean; data?: { lobby: boolean; username?: boolean } } =
				await existsRes.json();

			if (!existsRes.ok || !exists.success) {
				error = {
					code: 'Internal',
					message: 'Internal server error. Please try again later.'
				};
				return;
			}

			if (exists?.data?.lobby) {
				error = { code: 'Lobby', message: `Lobby "${lobbyName}" already exists.` };
				return;
			}

			const createRes = await fetch(`${PUBLIC_API_ENDPOINT}/create_lobby`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lobby_name: lobbyName, initial_state: data })
			});

			const create: { success: boolean } = await createRes.json();

			if (!createRes.ok || !create.success) {
				error = { code: 'Internal', message: 'Internal server error. Please try again later.' };
				return;
			} else {
				goto(`/lobby/?id=${lobbyName}&username=${username}`);
			}
		} catch (e) {
			error = { code: 'Internal', message: 'Internal server error. Please try again later.' };
		} finally {
			isFetching = false;
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
				<div class="text-muted-foreground flex items-center px-16 py-2">
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
		disabled={createDisabled}
		on:click={onSubmit}>Create Lobby</Button
	>
</div>
