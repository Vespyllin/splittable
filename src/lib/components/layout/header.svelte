<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	let img = '/bill.png';
</script>

<div class={cn('flex h-[4.5rem] justify-center', className)}>
	<img src={img} alt="" class="left-0 h-[4.5rem] invert" />
	<div class="ml-5 flex h-full items-center">
		<h1 class="text-4xl font-bold text-primary">Splittable</h1>
	</div>
</div>
