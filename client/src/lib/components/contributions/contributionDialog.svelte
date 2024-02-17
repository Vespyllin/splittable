<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import * as Dialog from '../ui/dialog';

	import ContributionItem from './contributionItem.svelte';
	import ContributionInput from './contributionInput.svelte';

	import type { EntryData } from '$lib/types/lobby';

	export let entry: EntryData;
	export let sendUpdate: (v: number) => void;
	export let defaultValue: number | undefined;

	let contributionAmount: number = defaultValue ?? 1;
	let isOpen = false;
</script>

<Dialog.Root
	bind:open={isOpen}
	onOutsideClick={(e) => {
		//! Prevents immediate opening of other items after closing
		e.preventDefault();
		setTimeout(() => {
			isOpen = false;
		}, 5);
	}}
>
	<Dialog.Trigger class="w-full">
		<ContributionItem {entry} />
	</Dialog.Trigger>
	<Dialog.Content class="flex h-fit min-h-fit w-[90%] flex-col rounded-xl px-4">
		<ContributionInput {entry} bind:contributionAmount />
		<Dialog.Close class="mb-2 mt-2">
			{#if !defaultValue}
				<Button class="h-11 w-full text-xl" on:click={() => sendUpdate(contributionAmount)}>
					Save
				</Button>
			{:else}
				<div class="flex gap-2">
					<Button
						class="h-11 w-1/2 text-xl"
						disabled={contributionAmount == defaultValue}
						on:click={() => sendUpdate(contributionAmount)}>Update</Button
					>
					<Button
						class="h-11 w-1/2 text-xl"
						on:click={() => {
							contributionAmount = 1;
							sendUpdate(0);
						}}>Remove</Button
					>
				</div>
			{/if}
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
