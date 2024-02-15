<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	import ItemContribution from '$lib/components/contributions/entry.svelte';

	import type { EntryData } from '$lib/types/lobby';

	import { Minus, Plus } from 'radix-icons-svelte';
	import { Euro } from '$lib/utils';

	const plusHandler = () => {
		if (numerator >= denominator) numerator += 1;
		else denominator = Math.max(denominator - 1, 1);
	};

	const minusHandler = () => {
		if (numerator > denominator) numerator = Math.max(numerator - 1, 1);
		else denominator = denominator + 1;
	};

	let numerator = 1;
	let denominator = 1;
	let plusDisabled = false;
	$: plusDisabled = numerator / denominator == entry.item.quantity;

	export let entry: EntryData;
	export let contributionAmount: number = 1;

	if (contributionAmount >= 1) numerator = contributionAmount;
	else denominator = 1 / contributionAmount;

	$: contributionAmount = numerator / denominator;
</script>

<div>
	<h1 class="text-semibold mb-4 justify-center text-3xl">
		Set your <span class="text-primary font-semibold"> Contribution </span>
	</h1>
	<ItemContribution {entry} />

	<div class="mt-4 grid h-12 w-full grid-cols-5 gap-2 p-1 text-2xl leading-[2.4rem]">
		<div class="p-auto col-span-2 w-full rounded-md border text-center">
			{Euro.format(entry.item.price * (contributionAmount ?? 1))}
		</div>
		<div class="col-span-1 rounded-md border text-center">
			{#if denominator > 1}
				<sup>{numerator}</sup>/<sub>{denominator}</sub>
			{:else}
				{numerator}
			{/if}
		</div>
		<div>
			<Button class="h-full w-full" disabled={plusDisabled} on:click={() => plusHandler()}>
				<Plus />
			</Button>
		</div>
		<Button class="h-full w-full" on:click={() => minusHandler()}>
			<Minus />
		</Button>
	</div>
</div>
