<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	import MinimalHeader from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import ContributionEntry from '$lib/components/contributionEntry.svelte';

	import type { Lobby } from '$lib/types/state';
	import { io } from 'socket.io-client';

	export let data;

	data.lobbyID;

	// TODO: import username store, set self field to that
	// TODO: set handler for onconnect server emit to update contributor data
	// 		 and handler for onstateupdate server emit to update state data
	let state: Lobby = {
		selfId: '',
		contributors: ['name1', 'name2', 'name3', 'name4', 'name4', 'name3', 'name4', 'name4'],
		entries: [
			{
				name: 'item 1',
				total: '500',
				quantity: '1',
				price: '500',
				contributors: [
					{ contributorId: 'username1', contribution: 1 },
					{ contributorId: 'username3', contribution: 3 }
				]
			},
			{
				name: 'item 2',
				total: '30.99',
				quantity: '2',
				price: '15.49',
				contributors: []
			}
		]
	};

	let Euro = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR'
	});

	state.entries = state.entries.map((v) => {
		return {
			...v,
			price: Euro.format(parseFloat(v.price)),
			total: Euro.format(parseFloat(v.total))
		};
	});

	// const socket = io(`ws://localhost:3000/${data.lobbyID}`);

	let haveSocketPromise = (async () => {
		return true;
	})();
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader img="../bill.png" />

	<Separator class="my-3" />

	{#await haveSocketPromise}
		<Skeleton class="h-6 w-full" />
	{:then haveSocket}
		{#if haveSocket}
			<h1 class="text-xl">Lobby members</h1>
			<div class="my-2 flex w-full flex-wrap">
				{#each state.contributors as contributor, idx}
					<p class="mx-1 text-primary">
						{contributor}{#if idx != state.contributors.length - 1}<span class="text-foreground"
								>,</span
							>{/if}
					</p>
				{/each}
			</div>

			<h1 class="text-xl">Entries</h1>
			<!-- TODO: Wrap in dialog for contribution selection and detailed view -->
			<div class="flew grow flex-col">
				{#each state.entries as entry, idx}
					<ContributionEntry {entry} />
					{#if state.entries.length - 1 != idx}
						<Separator class="m-1 mx-auto my-2 w-[75%] bg-primary" />
					{/if}
				{/each}
			</div>
		{:else}
			<p>Not Found</p>
		{/if}
	{:catch error}
		<p class="text-red-600">{error.message}</p>
	{/await}

	<!-- {content} -->

	<Footer class="my-auto" />
</div>
