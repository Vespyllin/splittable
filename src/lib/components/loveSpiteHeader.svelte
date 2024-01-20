<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('flex items-center', className)}>
	<img src="./bill.png" alt="" class="left-0 h-[100%] invert" />
	<div class="flex-col space-y-2">
		<h1 class="ml-5 mt-auto w-[11rem] text-center text-4xl font-bold text-primary">Splittable</h1>
		<h2 class="ml-5 mt-auto w-[11rem] text-center text-2xl">Made with Love and Spite</h2>
	</div>
</div>
