<script lang="ts">
	import { goto } from '$app/navigation';
	import { getDoctorAppointment, storeCurrentUser } from '$lib/supabase';
	import Appointment from '$lib/components/Appointment.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $storeCurrentUser === null}
	<div class="w-full h-full flex flex-col items-center justify-center">
		<h1>Vous n'etes pas connecté</h1>
		<button on:click={() => goto('/profile')} class="btn variant-filled-tertiary">
			Se connecter
		</button>
	</div>
{/if}

{#if $storeCurrentUser !== null}
	<h1 class="m-4">Bienvenue {$storeCurrentUser.data.firstName}</h1>
	<div class="grid grid-cols-1 lg:grid-cols-2">
		{#await getDoctorAppointment()}
			<Appointment appointment={null} />
			<Appointment appointment={null} />
			<Appointment appointment={null} />
			<Appointment appointment={null} />
		{:then appointments}
			{#each appointments as appointment}
				<Appointment {appointment} />
			{/each}
		{/await}
	</div>
{/if}
