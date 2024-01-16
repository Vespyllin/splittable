<script lang="ts">
	import MinimalHeader from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import Loading from './components/loading.svelte';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { io } from 'socket.io-client';
	import type { Lobby } from '$lib/types/state';

	export let data;

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

	let content = {};

	let x = 0;
	const setSocket = async () => {
		console.log('SETTING SOCKET', data.lobbyID);
		const socketCheck = await fetch(`http://localhost:5173/check_lobby/${data.lobbyID}`);

		if (socketCheck.status != 200) {
			console.log('SOCKET NOT FOUND', socketCheck.status);
			return false;
		}

		const socket = io(`ws://localhost:3000/${data.lobbyID}`);
		console.log(socket.connected);
		socket.on('connect', () => {
			console.log('Successfully connected to socket');
		});

		socket.on('messages', (messages: any) => {
			console.log('received msg', JSON.stringify(messages), x++);
			content = JSON.stringify(messages);
		});

		return true;
	};

	let haveSocketPromise = (async () => {
		return true;
	})();
	// setSocket();
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader img="../bill.png" />

	<Separator class="my-3" />

	{#await haveSocketPromise}
		<Loading />
	{:then haveSocket}
		{#if haveSocket}
			<h1>Lobby members:</h1>
			<div class="my-2 flex w-full flex-wrap border-l-2">
				{#each state.contributors as contributor, idx}
					<p class="mx-1 text-primary">
						{contributor}{#if idx != state.contributors.length - 1}<span class="text-foreground"
								>,</span
							>{/if}
					</p>
				{/each}
			</div>

			<div class="flex justify-center">
				<Separator class="my-3 w-[75%]" />
			</div>

			{#each state.entries as entry}
				<div class="mb-2 flex h-fit flex-col rounded-sm border-2 p-2">
					<div class="grid h-auto w-full grid-cols-11 gap-2">
						<div class="col-span-5 border-b-2 pl-1">{entry.name}</div>
						<div class="col-span-2 border-b-2 pl-1">{entry.quantity}</div>
						<!-- TODO: Format intl -->
						<div class="col-span-4 border-b-2 pl-1">{entry.price}</div>
					</div>

					<div class="mt-2 flex border-b-2">
						<div class="py-auto no-scrollbar justify-even my-auto flex w-full pl-1">
							{#if entry.contributors.length == 0}
								<p class="text-muted-foreground">no contributors</p>
							{:else}
								{#each entry.contributors as contributor, idx}
									<div>
										<div class="tracking-tight">
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
			{/each}
		{:else}
			<p>Not Found</p>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

	<!-- {content} -->

	<Footer />
</div>
