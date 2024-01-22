<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	import MinimalHeader from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import ContributionEntry from '$lib/components/contributionEntry.svelte';

	import type { Lobby } from '$lib/types/state';
	import { io } from 'socket.io-client';
	import { username } from '$lib/stores/username.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

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

	const Euro = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR'
	});

	let contributionAmount = '';

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

<div class="flex h-screen w-screen flex-col px-8 pt-8">
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
				<!-- TODO: Wrap in dialog for contribution selection and detailed view -->
				<div class="flew grow flex-col">
					{#each state.entries as entry, idx}
						<Dialog.Root>
							<Dialog.Trigger class="w-full">
								<ContributionEntry {entry} />
								{#if state.entries.length - 1 != idx}
									<Separator class="m-1 mx-auto my-2 w-[75%] bg-primary" />
								{/if}
							</Dialog.Trigger>
							<Dialog.Content class="flex w-[90%] flex-col rounded-md">
								<h1 class="text-semibold text-2xl">Set your contribution</h1>
								<ContributionEntry {entry} />
								<div class="flex items-center gap-2">
									<div>{Euro.format(parseFloat(entry.price))}</div>
									<div>1/4</div>
									<Button>+</Button>
									<Button>-</Button>
								</div>
								<div>save cancel</div>
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

	<!-- {content} -->

	<Footer class="mt-auto" />
</div>
