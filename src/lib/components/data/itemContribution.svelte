<script lang="ts">
	import type { ContributionData } from '$lib/types/state';
	import { cn } from '$lib/utils';

	export let entry: ContributionData;

	const entryStyle = 'flex h-9 border-b px-3 py-2 text-xl min-w-fit';

	const Euro = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR'
	});
</script>

<div class="my-1 grid grid-cols-1 gap-2">
	<div class="flex flex-wrap gap-1">
		<div class={cn('grow font-semibold text-primary', entryStyle)}>
			{entry.name}
		</div>
		<div class="flex min-w-[50%] grow gap-2">
			<div class={cn('w-[40%]', entryStyle)}>
				{entry.quantity}
			</div>
			<div class={cn('w-[60%]', entryStyle)}>
				{Euro.format(parseFloat(entry.price))}
				<span class="pl-1 pt-1 align-sub text-[10px]">/item</span>
			</div>
		</div>
	</div>
	<div class="flex w-full border-b px-2 py-1 text-xl">
		{#if entry.contributors.length == 0}
			<p class="text-muted-foreground">no contributors</p>
		{:else}
			<div class="flex w-full flex-wrap gap-2">
				{#each entry.contributors as contributor}
					<p>
						{contributor.name}:<span class="w-fit text-primary">
							{contributor.contribution}
						</span>
					</p>
				{/each}
			</div>
		{/if}
	</div>
</div>
