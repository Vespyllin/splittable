<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import MinimalHeader from '$lib/components/layout/header.svelte';
	import LobbyInput from '$lib/components/lobby/lobbyInput.svelte';
	import ReceiptItemInput from '$lib/components/lobby/itemInput.svelte';

	import { goto } from '$app/navigation';

	import type { ValidationCode } from '$lib/types/lobby';
	import { Plus } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { Euro } from '$lib/util/util';

	type ItemFormData = { name: string; total: string; quantity: string; price: string }[];

	let error: { code: ValidationCode; message?: string } = { code: 'Valid' };

	let username: string | undefined = undefined;
	let lobbyName: string | undefined = undefined;

	let data: ItemFormData = [];
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

<div class="flex grow flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	<div class="space-y-2">
		<h1 class="text-center text-2xl font-semibold tracking-tight">Create a Lobby</h1>

		<div>
			<LobbyInput bind:error={error.code} bind:username bind:lobbyName />
			<p class={cn('text-center text-sm text-red-600', !error.message && 'hidden')}>
				{error.message}
			</p>
		</div>
	</div>

	<div class="mt-4 flex text-xl">
		<div>
			<span># of Items:</span>
			<span class="text-primary">
				{data.length}
			</span>
		</div>
		<div class="ml-auto">
			<span>Bill Total:</span>
			<span class="text-primary">
				{Euro.format(
					data
						.map((x) => (!!x.total && x.quantity ? parseFloat(x.total) : 0))
						.reduce((acc, val) => (acc += val), 0)
				)}
			</span>
		</div>
	</div>

	<div class="mt-2 flex w-full items-center">
		<h2 class="text-2xl">Receipt Items</h2>
		<Button
			class="ml-auto h-8 w-12"
			on:click={() => {
				data = [...data.reverse(), { name: '', total: '', quantity: '', price: '' }].reverse();
			}}
		>
			<Plus />
		</Button>
	</div>

	<div class="mb-4 mt-2">
		{#if data.length == 0}
			<div class="text-muted-foreground flex h-20 items-center px-16">
				<h1 class="text-lg">🤔 You can't split a bill with no items...</h1>
			</div>
		{/if}
		{#key data.length}
			{#each data as item, idx}
				{#if idx != 0}
					<Separator class="mx-auto my-2 w-[75%]" />
				{/if}

				<ReceiptItemInput class="h-20" bind:item onDelete={() => (data = data.toSpliced(idx, 1))} />
			{/each}
		{/key}
	</div>

	<Button
		class="mx-auto mb-2 mt-auto h-12 w-full text-lg"
		disabled={createDisabled}
		on:click={onSubmit}
	>
		Create Lobby
	</Button>
</div>
