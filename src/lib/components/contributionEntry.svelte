<script lang="ts">
	import type { ContributionEntry } from '$lib/types/state';
	import { cn } from '$lib/utils';

	export let entry: ContributionEntry;

	const entryStyle = 'flex h-9 border-b px-3 py-2 text-sm min-w-fit';
</script>

<div class="my-1 grid grid-cols-1 gap-2">
	<div class="flex space-x-2">
		<div class={cn('grow', entryStyle)}>
			{entry.name}
		</div>
		<div class={cn('w-[20%]', entryStyle)}>
			{entry.quantity}
		</div>
		<div class={cn('w-[30%]', entryStyle)}>
			{entry.price} <span class="pl-1 pt-1 align-sub text-[10px]">/item</span>
		</div>
	</div>
	<div class="flex h-9 w-full border-b px-2 py-1 text-sm">
		<div class="no-scrollbar justify-even my-auto flex w-full px-1">
			{#if entry.contributors.length == 0}
				<p class="text-muted-foreground">no contributors</p>
			{:else}
				{#each entry.contributors as contributor, idx}
					<div>
						<div>
							{contributor.contributorId}:
							<span class="text-primary">{contributor.contribution}</span
							>{#if idx != entry.contributors.length - 1}<span class="pr-1">,</span>{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
