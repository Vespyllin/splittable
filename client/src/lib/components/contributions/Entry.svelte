<script lang="ts">
	import type { EntryData } from '$lib/types/state';
	import { cn } from '$lib/utils';

	export let entry: EntryData;

	const entryStyle = 'flex h-9 border-b px-3 py-2 text-xl min-w-fit';
	let isSettled = false;
	$: {
		isSettled =
			entry.contributions.length != 0 &&
			entry.contributions.map((x) => x.amount).reduce((acc, val) => (acc += val)) ==
				parseInt(entry.item.quantity);
	}

	const Euro = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR'
	});
</script>

<div class="my-1 grid grid-cols-1 gap-2">
	<div class="flex flex-wrap gap-1">
		<div class={cn('grow', entryStyle, isSettled && 'text-primary')}>
			{entry.item.name}
		</div>
		<div class="flex min-w-[50%] grow gap-2">
			<div class={cn('w-[40%]', entryStyle, isSettled && 'text-muted-foreground')}>
				{entry.item.quantity}
			</div>
			<div class={cn('w-[60%]', entryStyle, isSettled && 'text-muted-foreground')}>
				{Euro.format(parseFloat(entry.item.price))}
				<span class="pl-1 pt-1 align-sub text-[10px]">/item</span>
			</div>
		</div>
	</div>
	<div class="flex w-full border-b px-2 py-1 text-xl">
		{#if entry.contributions.length == 0}
			<p class="text-muted-foreground">no contributors</p>
		{:else}
			<div class="flex w-full flex-wrap gap-2">
				{#each entry.contributions as contribution}
					<p class={cn(isSettled && 'text-muted-foreground')}>
						{contribution.username}:<span
							class={cn('ml-1 w-fit', isSettled && 'text-muted-foreground')}
						>
							{#if contribution.amount >= 1}
								{contribution.amount}
							{:else}
								<sup>1</sup>/<sub>{1 / contribution.amount}</sub>
							{/if}
						</span>
					</p>
				{/each}
			</div>
		{/if}
	</div>
</div>
