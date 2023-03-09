<script lang="ts">
	import { createUser, loginUser, supabase, logoutUser, storeCurrentUser } from '$lib/supabase';
	import { Avatar, ProgressRadial, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import AsyncButton from '$lib/components/AsyncButton.svelte';
	import { goto } from '$app/navigation';

	// supabase.auth.signOut();
	let email: string = '';
	let password: string = '';
	let passwordBis: string = '';
	let name: string = '';
	let firstName: string = '';
	let profession: string = '';
	let tab = 0;

	async function login() {
		await loginUser(email, password);
	}

	async function register() {
		await createUser(email, password, name, firstName, profession);
	}

	async function logout() {
		await logoutUser();
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="w-full h-full flex items-center justify-center">
	{#if $storeCurrentUser === null}
		<div class="grid grid-cols-2 gap-4 mx-4 w-full lg:max-w-xl">
			<div class="col-span-2 my-4">
				<TabGroup justify="justify-center">
					<Tab bind:group={tab} name="Connection" value={0}>Connection</Tab>
					<Tab bind:group={tab} name="Rejoindre" value={1}>Rejoindre</Tab>
				</TabGroup>
			</div>
			{#if tab === 0}
				<h1 class="text-center col-span-2 font-kala-important">Connection</h1>
				<input
					class="input p-2 col-span-2"
					placeholder="email@gmail.com"
					type="email"
					bind:value={email}
				/>
				<input
					class="input p-2 col-span-2"
					placeholder="Password"
					type="password"
					bind:value={password}
				/>
				<AsyncButton
					class="btn variant-filled-primary col-span-2"
					onClick={login}
					disabled={password === '' || email === ''}
				>
					Connection
				</AsyncButton>
			{/if}
			{#if tab === 1}
				<h1 class="text-center col-span-2 font-kala-important">Rejoindre</h1>
				<input class="input p-2" placeholder="Nom" type="text" bind:value={name} />
				<input class="input p-2" placeholder="Prénom" type="text" bind:value={firstName} />
				<input
					class="input p-2 col-span-2"
					placeholder="email@gmail.com"
					type="email"
					bind:value={email}
				/>
				<input
					class="input p-2 col-span-2"
					placeholder="Profession"
					type="text"
					bind:value={profession}
				/>
				<input
					class="input p-2 col-span-2"
					placeholder="Password"
					type="password"
					bind:value={password}
				/>
				<input
					class="input p-2 col-span-2"
					placeholder="Confirmation"
					type="password"
					bind:value={passwordBis}
				/>
				<AsyncButton
					class="btn variant-filled-secondary col-span-2"
					onClick={register}
					disabled={password !== passwordBis ||
						password.length < 8 ||
						email.length < 8 ||
						name.length < 2 ||
						firstName.length < 2}
				>
					Rejoindre
				</AsyncButton>
			{/if}
		</div>
	{:else}
		<div class="card grid grid-cols-2 gap-y-4 p-4 w-full m-4 lg:max-w-xl">
			<div class="col-span-2 place-content-center flex">
				<Avatar src={`https://api.multiavatar.com/${$storeCurrentUser.user.id}.svg`} width="w-36" />
			</div>
			<h1 class="text-center capitalize">{$storeCurrentUser.data.name}</h1>
			<h1 class="text-center capitalize">{$storeCurrentUser.data.firstName}</h1>
			<h1 class="col-span-2 text-center capitalize">{$storeCurrentUser.data.type}</h1>
			<AsyncButton class="btn variant-filled-error col-span-2" onClick={logout}
				>Deconnection
			</AsyncButton>
		</div>
	{/if}
</div>
