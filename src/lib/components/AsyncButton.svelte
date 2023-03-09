<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	export let onClick: () => Promise<void>;
	let promise: Promise<void> | null;

	async function internalClick(): Promise<void> {
		promise = onClick();
		await promise;
		promise = null;
	}
</script>

<button class={$$restProps.class} on:click={internalClick}>
	{#if promise}
		<ProgressRadial
			class="w-7 h-full mr-4"
			meter="stroke-primary-900 dark:stroke-primary-50"
			track="stroke-transparent-500/30"
			stroke={90}
		/>
	{/if}
	<slot />
</button>
