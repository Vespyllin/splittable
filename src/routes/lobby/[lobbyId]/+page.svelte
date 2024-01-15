<script lang="ts">
	import MinimalHeader from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import Loading from '../components/loading.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { Socket, io } from 'socket.io-client';
	import type { Lobby } from '$lib/types/state';

	export let data;

	// TODO: import username store, set self field to that
	// TODO: set handler for onconnect server emit to update contributor data
	// 		 and handler for onstateupdate server emit to update state data
	let state: Lobby = {
		selfId: '',
		contributors: [],
		state: []
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

	const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));

	let haveSocketPromise = sleep(1);
	// setSocket();
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader img="../bill.png" />

	<Separator class="my-3" />

	{#await haveSocketPromise}
		<Loading />
	{:then haveSocket}
		{#if haveSocket}
			<p>Found</p>
		{:else}
			<p>Not Found</p>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

	<!-- {content} -->

	<Footer />
</div>
