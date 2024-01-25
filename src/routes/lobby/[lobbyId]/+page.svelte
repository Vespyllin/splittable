<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	import MinimalHeader from '$lib/components/layout/header.svelte';
	import ItemContribution from '$lib/components/data/itemContribution.svelte';
	import ContributionInput from '$lib/components/input/contributionInput.svelte';

	import type { Lobby } from '$lib/types/state';
	import { io } from 'socket.io-client';
	import { username } from '$lib/stores/username.js';

	export let data;

	data.lobbyID;

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

	// const socket = io(`ws://localhost:3000/${data.lobbyID}`);

	const setup = async () => {
		// try {
		// 	await socket.timeout(1000).emitWithAck('register', $username);
		// 	state.contributors.push($username);
		// 	socket.on('update', (payload) => {
		// 		console.log(payload);
		// 	});
		// } catch (error) {
		// 	console.log(`Failed to register ${$username}`);
		// 	return false;
		// }

		return true;
	};
</script>

<div class="flex h-full w-full flex-col">
	<MinimalHeader img="../bill.png" />

	<Separator class="my-3" />

	{#await setup()}
		<Skeleton class="h-6 w-full" />
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
							<Dialog.Content class="flex h-fit min-h-[40%] w-[90%] flex-col rounded-xl px-4">
								<ContributionInput {entry} />
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
