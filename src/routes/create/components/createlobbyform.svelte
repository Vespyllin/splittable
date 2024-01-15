<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import ItemEntry from '../itementry.svelte';

	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let submitCallback: ((e: any) => void) | ((e: any) => Promise<void>) = () => {
		console.log('TODO: create lobby submit');
	};
	export { submitCallback as onSubmit };

	let isLoading = false;

	let name: string;
	let total: string;
	let quantity: string;
	let price: string;

	export let lobbyName: string;
	export let data: { name: string; total: string; quantity: string; price: string }[];
</script>

<div class={cn('flex w-full grow flex-col items-center overflow-y-hidden', className)}>
	<div class="mb-5 flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-bold tracking-tight">Create a Lobby</h1>
	</div>

	<div class="w-full">
		<Label class="ml-1 text-sm">Lobby Code</Label>
		<Input
			id="lobby"
			placeholder="Ta' Mattea"
			type="text"
			autocapitalize="none"
			autocorrect="off"
			disabled={isLoading}
			bind:value={lobbyName}
		/>
	</div>

	<Separator class="mx-auto my-3 h-[2px] w-[75%]" />

	<form class="mb-5 flex w-full flex-col border-b-2 pb-3">
		<ItemEntry
			bind:name
			bind:quantity
			bind:price
			bind:total
			buttonText="Add Item"
			onSubmit={() => {
				data.push({ name, total, quantity, price });
				data = data;
			}}
		/>
	</form>

	<div class="h-[50%] w-full flex-col overflow-y-scroll">
		{#each data as item, idx}
			{#if idx != 0}
				<Separator class="mx-auto my-2 w-[75%] bg-primary" />
			{/if}
			<ItemEntry
				bind:name={item.name}
				bind:quantity={item.quantity}
				bind:price={item.price}
				bind:total={item.total}
				buttonText="Remove"
				onSubmit={() => (data = data.toSpliced(idx, 1))}
			/>
		{/each}
	</div>

	<div class="absolute bottom-10 left-0 flex h-fit w-full justify-center">
		<Button class="h-12 w-[95%] text-lg" on:click={submitCallback}>Create Lobby</Button>
	</div>
</div>
