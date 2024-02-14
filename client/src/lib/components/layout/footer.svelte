<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('m-0 mx-auto mt-auto h-fit max-w-[95%] pb-2', className)}>
	<footer class="text-muted-foreground justify-evenly text-center text-[0.7rem] text-sm">
		Għal Kyle għax kien qed jitnejjikli bid-degree.
	</footer>
</div>
