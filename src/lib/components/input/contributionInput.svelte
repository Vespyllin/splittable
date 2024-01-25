<script lang="ts">
	import type { ContributionData } from '$lib/types/state';
	import { Minus, Plus } from 'radix-icons-svelte';
	import ContributionEntry from './itemContribution.svelte';
	import Button from './ui/button/button.svelte';

	const plusHandler = () => {
		if (numerator >= denominator) numerator = numerator + 1;
		else denominator = Math.max(denominator - 1, 1);
	};

	const minusHandler = () => {
		if (numerator > denominator) numerator = Math.max(numerator - 1, 1);
		else denominator = denominator + 1;
	};

	let numerator = 1;
	let denominator = 1;
	let contributionFraction = 1;

	$: contributionFraction = numerator / denominator;
	export let entry: ContributionData;

	const Euro = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR'
	});
</script>

<h1 class="text-semibold mb-4 justify-center text-3xl">
	Set your <span class="font-semibold text-primary"> Contribution </span>
</h1>
<ContributionEntry {entry} />

<div class="mt-4 grid h-12 w-full grid-cols-5 gap-2 p-1 text-2xl leading-[2.4rem]">
	<div class="p-auto col-span-2 w-full rounded-md border text-center">
		{Euro.format(parseFloat(entry.price) * contributionFraction)}
	</div>
	<div class="col-span-1 rounded-md border text-center">
		{#if denominator > 1}
			<sup>{numerator}</sup>/<sub>{denominator}</sub>
		{:else}
			{numerator}
		{/if}
	</div>
	<div>
		<Button class="h-full w-full" on:click={() => plusHandler()}>
			<Plus />
		</Button>
	</div>
	<Button class="h-full w-full" on:click={() => minusHandler()}>
		<Minus />
	</Button>
</div>
<div class="mb-2 mt-auto">
	<!-- TODO: Save or Remove contribution depending on if the user has an entry -->
	<Button class="h-11 w-full text-xl">Save</Button>
</div>
