<script lang="ts">
	import type { ContributionEntry } from '$lib/types/state';

	export let entry: ContributionEntry;
</script>

<div class="my-1 grid grid-cols-1 gap-2">
	<div class="flex space-x-2">
		<div class="flex h-9 min-w-fit grow rounded-md border px-3 py-2 text-sm">
			{entry.name}
		</div>
		<div class="flex h-9 w-[20%] min-w-fit rounded-md border px-3 py-2 text-sm">
			{entry.quantity}
		</div>
		<div class="flex h-9 w-[30%] min-w-fit rounded-md border px-3 py-2 text-sm">
			{entry.price} <span class="pl-1 pt-1 align-sub text-[10px]">/item</span>
		</div>
	</div>
	<div class="flex h-9 w-full rounded-md border px-2 py-1 text-sm">
		<div class="no-scrollbar justify-even my-auto flex w-full px-1">
			{#if entry.contributors.length == 0}
				<p class="text-muted-foreground">no contributors</p>
			{:else}
				{#each entry.contributors as contributor, idx}
					<div>
						<div class="">
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
