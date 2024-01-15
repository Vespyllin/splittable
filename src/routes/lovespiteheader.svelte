<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('flex', className)}>
	<img src="./bill.png" alt="" class="left-0 h-full invert" />
	<div class="flex-col">
		<h1 class="ml-5 mt-auto w-[11rem] text-center text-4xl text-primary">Il-Bill Splitter</h1>

		<Separator class="mx-auto my-1 w-[65%]" />

		<h2 class="ml-5 mt-auto w-[11rem] text-center text-3xl">Made with Love and Spite🧡</h2>
	</div>
</div>
