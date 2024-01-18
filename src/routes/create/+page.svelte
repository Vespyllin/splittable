<script lang="ts">
	import CreateLobbyForm from '../../lib/components/createLobbyForm.svelte';
	import MinimalHeader from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<div class="flex h-screen w-screen flex-col p-8">
	<MinimalHeader />

	<Separator class="my-3" />

	<CreateLobbyForm />

	<Footer />
</div>
