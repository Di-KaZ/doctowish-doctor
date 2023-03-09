<script lang="ts">
	import '../app.postcss';
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { page } from '$app/stores';

	import {
		AppShell,
		AppBar,
		LightSwitch,
		AppRail,
		TabGroup,
		Tab,
		Toast,
		Avatar
	} from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { storeCurrentUser, fetchCurrentUser } from '$lib/supabase';
	import { User, Home } from 'svelte-heros-v2';
	import { Screens } from '$lib/types/screens';
	import { goto } from '$app/navigation';
	import { pwaInfo } from 'virtual:pwa-info';
	import { preventAutoInstallPrompt } from '../pwa';

	// make tab containing the tab of the current screen
	let tab = Screens.getScreenFromPath($page.url.pathname)?.tab ?? 0;

	// when tab change redirect to the new screen
	$: {
		const newTab = Screens.getScreenFromTab(tab);
		if (!import.meta.env.SSR && newTab) goto(newTab.path);
	}
	onMount(async () => {
		preventAutoInstallPrompt();
		fetchCurrentUser();
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r: any) {
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error: any) {
					console.log('SW registration error', error);
				}
			});
		}
	});
	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<main class="w-screen h-screen">
	<AppShell>
		<svelte:fragment slot="header">
			<AppBar padding="p-2" slotTrail="place-content-end">
				<h1
					class="font-kala-important bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone font-bold"
				>
					DoctoWish<span class="text-white text-sm">Doctor</span>
				</h1>
				<svelte:fragment slot="trail">
					{#if $storeCurrentUser}
						<Avatar src={`https://api.multiavatar.com/${$storeCurrentUser.user.id}.svg`} />
					{/if}
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>

		<svelte:fragment slot="sidebarLeft">
			<div class="hidden lg:inline">
				<AppRail selected={writable(1)}>
					<svelte:fragment slot="lead">
						<!-- AppRailTiles -->
						<div class="hidden">
							<LightSwitch />
						</div>
					</svelte:fragment>
					<div class="flex flex-col h-full">
						<button
							on:click={() => (tab = 0)}
							class={`flex-1 ${tab === 0 ? 'variant-filled-primary' : ''}`}
						>
							<div class="flex items-center justify-center"><Home size="40" /></div>
						</button>
						<button
							on:click={() => (tab = 1)}
							class={`flex-1 ${tab === 1 ? 'variant-filled-primary' : ''}`}
						>
							<div class="flex items-center justify-center"><User size="40" /></div>
						</button>
					</div>
					<!-- AppRailTiles -->
					<svelte:fragment slot="trail">
						<!-- AppRailTiles -->
					</svelte:fragment>
				</AppRail>
			</div>
		</svelte:fragment>
		<slot />
		<svelte:fragment slot="footer">
			<div class="lg:hidden">
				<TabGroup border="" active="variant-filled-primary" rounded="jsutify-center">
					<Tab flex="flex-1" name="Home" value={0} bind:group={tab}>
						<div class="flex items-center justify-center"><Home size="40" /></div>
					</Tab>
					<Tab flex="flex-1" name="Settings" value={1} bind:group={tab}>
						<div class="flex items-center justify-center"><User size="40" /></div>
					</Tab>
				</TabGroup>
			</div>
		</svelte:fragment>
	</AppShell>
	<Toast position="t" />
</main>
