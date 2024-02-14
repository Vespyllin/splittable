<script lang="ts">
	import { usernameStore } from '$lib/store/username';
	import type { EntryData } from '$lib/types/lobby';
	import { Euro } from '$lib/util/util';
	import { cn } from '$lib/utils';
	import { readonly } from 'svelte/store';

	export let entry: EntryData;

	const username = readonly(usernameStore);

	const entryStyle = 'flex h-9 border-b px-3 py-2 text-xl min-w-fit text-stone-200';
	let isSettled = false;
	$: {
		isSettled =
			entry.contributions.length != 0 &&
			entry.contributions.map((x) => x.amount).reduce((acc, val) => (acc += val)) ==
				entry.item.quantity;
	}
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
				{Euro.format(entry.item.price)}
				<span class="pl-1 pt-1 align-sub text-[10px]">/item</span>
			</div>
		</div>
	</div>
	<div class="flex w-full border-b px-2 py-1 text-xl">
		{#if entry.contributions.length == 0}
			<p class="text-muted-foreground">no contributors</p>
		{:else}
			<div class="flex w-full flex-wrap gap-x-4 gap-y-2">
				{#each entry.contributions as contribution}
					<div>
						<span
							class={cn(
								isSettled && 'text-muted-foreground',
								contribution.username == $username && 'text-primary'
							)}
						>
							{contribution.username}:
						</span>
						<span class={cn('text-stone-400', isSettled && 'text-muted-foreground')}>
							{#if contribution.amount >= 1}
								{contribution.amount}
							{:else}
								<sup>1</sup>/<sub>{1 / contribution.amount}</sub>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
