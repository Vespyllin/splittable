<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import ItemContribution from '$lib/components/data/itemContribution.svelte';
	import ContributionInput from '$lib/components/input/contributionInput.svelte';

	import type { Lobby } from '$lib/types/state';
	import { io } from 'socket.io-client';

	export let data;
	const { lobbyId, username } = data;

	// TODO: import username store, set self field to that
	// TODO: set handler for onconnect server emit to update contributor data
	// 		 and handler for onstateupdate server emit to update state data
	let state: Lobby = {
		// contributors: [],
		// entries: []
		contributors: ['Paul', 'Kyle', 'Mattea', 'Sam', 'Milena', 'Carla'],
		entries: [
			{
				name: 'Steak',
				total: '150',
				quantity: '3',
				price: '50',
				contributors: [
					{ name: 'Paul', contribution: 1 },
					{ name: 'Mattea', contribution: 1 },
					{ name: 'Sam', contribution: 1 }
				]
			},
			{
				name: 'Chocolate Fondant',
				total: '30.99',
				quantity: '2',
				price: '15.49',
				contributors: []
			}
		]
	};

	const socket = io(`ws://localhost:3000/${lobbyId}`);

	const setup = async () => {
		try {
			await socket.timeout(1000).emitWithAck('register', username);
			state.contributors.push(username);
			socket.on('update', (payload) => {
				console.log("RECV on 'UPDATE':", payload);
			});
			socket.emit('update', 'penis');
		} catch (error) {
			console.log(`Failed to register ${username}`);
			return false;
		}

		// const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));
		// await sleep(10000);
		return true;
	};
</script>

<div class="flex h-full w-full flex-col">
	<MinimalHeader />

	<Separator class="my-3" />

	{#await setup()}
		<div class="mb-4 space-y-1">
			<Skeleton class="h-8 w-[70%] bg-muted" />
			<Skeleton class="h-8 w-full " />
			<Skeleton class="h-8 w-full" />
		</div>
		<Skeleton class="mb-2 h-8 w-[35%] bg-muted" />
		<div class="space-y-3">
			{#each { length: 3 } as _}
				<div class="grid grid-cols-3 gap-2">
					<Skeleton class="col-span-3 h-8" />
					<Skeleton class="h-8" />
					<Skeleton class="h-8" />
					<Skeleton class="h-8" />
				</div>
			{/each}
		</div>
	{:then haveSocket}
		{#if haveSocket}
			<h1 class="text-2xl font-semibold">Lobby members</h1>
			<div class="my-2 flex w-full flex-wrap">
				{#each state.contributors as contributor, idx}
					<p class="mx-1 text-xl text-primary">
						{contributor}{#if idx != state.contributors.length - 1}<span class="text-foreground"
								>,</span
							>{/if}
					</p>
				{/each}
			</div>
			<div class="mt-4">
				<h1 class="text-2xl font-semibold">Entries</h1>

				<div class="flew grow flex-col">
					{#each state.entries as entry, idx}
						<Dialog.Root>
							<Dialog.Trigger class="w-full">
								<ItemContribution {entry} />
								{#if state.entries.length - 1 != idx}
									<Separator class="m-1 mx-auto mb-1 mt-4 w-[75%] bg-primary" />
								{/if}
							</Dialog.Trigger>
							<Dialog.Content class="flex h-fit min-h-fit w-[90%] flex-col rounded-xl px-4">
								<ContributionInput {entry} />
								<!-- TODO: Save or Remove contribution depending on if the user has an entry -->
								<Dialog.Close class="mb-2 mt-2">
									{#if entry.contributors.findIndex((x) => x.name == username) == -1}
										<Button class="h-11 w-full text-xl">Save</Button>
									{:else}
										<div class="flex gap-2">
											<Button class="h-11 w-1/2 text-xl">Save</Button>
											<Button class="h-11 w-1/2 text-xl">Delete</Button>
										</div>
									{/if}
								</Dialog.Close>
							</Dialog.Content>
						</Dialog.Root>
					{/each}
				</div>
			</div>
		{:else}
			<p>Not Found</p>
		{/if}
	{:catch error}
		<p class="text-red-600">{error.message}</p>
	{/await}
</div>
