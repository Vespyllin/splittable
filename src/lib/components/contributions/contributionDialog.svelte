<script lang="ts">
	import type { ContributionData } from '$lib/types/state';
	import ItemContribution from '../contributions/itemContribution.svelte';
	import Button from '../ui/button/button.svelte';
	import * as Dialog from '../ui/dialog';
	import ContributionInput from './contributionInput.svelte';

	export let entry: ContributionData;
	export let sendUpdate: (v: number) => void;
	export let defaultValue: number | undefined;

	let contributionAmount: number = defaultValue ?? 1;
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		<ItemContribution {entry} />
	</Dialog.Trigger>
	<Dialog.Content class="flex h-fit min-h-fit w-[90%] flex-col rounded-xl px-4">
		<ContributionInput {entry} bind:contributionAmount />
		<Dialog.Close class="mb-2 mt-2">
			{#if !defaultValue}
				<Button
					class="h-11 w-full text-xl"
					on:click
					on:click={() => sendUpdate(contributionAmount)}
				>
					Save
				</Button>
			{:else}
				<div class="flex gap-2">
					<Button
						class="h-11 w-1/2 text-xl"
						disabled={contributionAmount == defaultValue}
						on:click={() => sendUpdate(contributionAmount)}>Update</Button
					>
					<Button class="h-11 w-1/2 text-xl" on:click={() => sendUpdate(0)}>Remove</Button>
				</div>
			{/if}
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
