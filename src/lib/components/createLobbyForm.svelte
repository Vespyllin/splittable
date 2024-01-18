<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Label from './ui/label/label.svelte';

	import LobbyInput from './lobbyInput.svelte';
	import ItemEntry from '$lib/components/itemEntry.svelte';

	import { cn } from '$lib/utils';
	import type { ReceiptEntry } from '$lib/types/state';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;

	// TODO: If invalid req, inline style red border and inline a placeholder with the error message
	let req: Promise<Response> | null = null;

	const onSubmit = () => {
		req = fetch('http://localhost:2400/create_lobby', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	};

	let lobbyName: string = '';
	let username: string = '';
	let data: ReceiptEntry[] = [];
</script>

<div class={cn('flex w-full grow flex-col items-center overflow-y-hidden', className)}>
	<div class="mb-2 flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-bold tracking-tight">Create a Lobby</h1>
	</div>

	<LobbyInput class="flex w-full flex-col space-y-2" bind:username bind:lobbyName />

	<Separator class="mx-auto my-3 h-[2px] w-[75%]" />

	<div class="mb-5 flex w-full items-center border-b-2 pb-3">
		<Label class="mb-1 text-lg">Receipt Items</Label>
		<Button
			class="ml-auto h-8 w-12"
			on:click={() => {
				data = [
					...data,
					{
						name: '',
						total: '',
						quantity: '',
						price: ''
					}
				];
			}}>+</Button
		>
	</div>

	<div class="h-[50%] w-full flex-col overflow-y-scroll">
		{#each data as item, idx}
			{#if idx != 0}
				<Separator class="mx-auto my-2 w-[75%]" />
			{/if}
			<ItemEntry bind:entryData={item} onSubmit={() => (data = data.toSpliced(idx, 1))} />
		{/each}
	</div>

	<div class="absolute bottom-10 left-0 flex h-fit w-full justify-center">
		<Button class="h-12 w-[95%] text-lg" on:click={onSubmit}>Create Lobby</Button>
	</div>
</div>
