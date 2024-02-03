<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import ContributionDialog from '$lib/components/contributions/contributionDialog.svelte';

	import type { Lobby } from '$lib/types/state';
	import type { UpdatePayload } from '$lib/types/server';
	import { io } from 'socket.io-client';

	export let data;
	const { lobbyId, username } = data;

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
				contributions: [
					{ name: 'Paul', amount: 1 },
					{ name: 'Mattea', amount: 1 },
					{ name: 'Sam', amount: 1 }
				]
			},
			{
				name: 'Coca Cola',
				total: '4.50',
				quantity: '3',
				price: '1.50',
				contributions: [{ name: 'person', amount: 2 }]
			},
			{
				name: 'Chocolate Fondant',
				total: '30.99',
				quantity: '2',
				price: '15.49',
				contributions: []
			}
		]
	};

	const socket = io(`ws://localhost:3000/${lobbyId}`);

	const setup = async () => {
		try {
			const registerRes = await socket.timeout(1000).emitWithAck('register', username);
			console.log('registerRes', registerRes);

			socket.on('update', (payload: UpdatePayload) => {
				console.log("RECV on 'UPDATE':", payload);

				const entryIdx = state.entries.findIndex((x) => {
					return x.name == payload.itemName;
				});

				if (entryIdx === -1) return console.log(`Could not find ${payload.itemName} in state.`);

				const contributionIdx = state.entries[entryIdx].contributions.findIndex(
					(x) => x.name == payload.username
				);

				if (contributionIdx !== -1) {
					state.entries[entryIdx].contributions[contributionIdx].amount = payload.contribution;
				} else {
					state.entries[entryIdx].contributions.push({
						name: payload.username,
						amount: payload.contribution
					});
				}
				state = { ...state };
			});
			// socket.disconnect();
		} catch (error) {
			console.log(`Failed to register ${username}`);
			return false;
		}

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
						{#if idx != state.contributors.length - 1}
							{contributor}<span class="text-foreground">,</span>
						{:else}
							{contributor}
						{/if}
					</p>
				{/each}
			</div>
			<div class="mt-4">
				<h1 class="text-2xl font-semibold">Entries</h1>

				<div class="flew grow flex-col">
					<!-- {#key } -->
					{#each state.entries as entry, idx}
						<ContributionDialog
							{entry}
							defaultValue={entry.contributions.find((x) => x.name == username)?.amount}
							sendUpdate={(v) => {
								const x = {
									username: username,
									itemName: entry.name,
									contribution: v
								};
								console.log('emitting', x);
								socket.emit('update', x);
							}}
						/>
						{#if state.entries.length - 1 != idx}
							<Separator class="m-1 mx-auto mb-1 mt-4 w-[75%] bg-primary" />
						{/if}
					{/each}
					<!-- {/key} -->
				</div>
			</div>
		{:else}
			<p>Not Found</p>
		{/if}
	{:catch error}
		<p class="text-red-600">{error.message}</p>
	{/await}
</div>
