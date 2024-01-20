<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('bg-lime-700" inset-x-0 mx-auto h-fit max-w-[95%]', className)}>
	<footer class="justify-evenly text-center text-[0.7rem] text-sm text-muted-foreground">
		Għal Kyle għax kien qed jitnejjikli bid-degree.
	</footer>
</div>
