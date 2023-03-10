import { createClient, type User } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_API_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';
import { get, writable } from 'svelte/store';
import type { Database } from '$lib/types/supabase';
export const supabase = createClient<Database>(PUBLIC_SUPABASE_API_URL, PUBLIC_SUPABASE_KEY);
import { toastStore } from '@skeletonlabs/skeleton';
import { vibrate } from '../pwa';

export function showMessage(message: string) {
	vibrate();
	toastStore.trigger({
		message,
		autohide: true,
		timeout: 5000
	});
}

// contains the current user
// prevent multiple requests to the server
export const storeCurrentUser = writable<{
	user: User;
	data: Database['public']['Tables']['user_info']['Row'];
} | null>(null);

export async function createUser(
	email: string,
	password: string,
	name: string,
	firstName: string,
	profession: string
) {
	const {
		data: { user },
		error
	} = await supabase.auth.signUp({
		email,
		password
	});
	if (error) {
		showMessage(error.message);
		return;
	}
	const { error: error2 } = await supabase.from('user_info').insert({
		name,
		firstName,
		user: user?.id,
		profession,
		type: 'doctor',
		email
	});
	if (error2) {
		showMessage(error2.message);
		console.log({ error2 });
		return;
	}
	fetchCurrentUser();
}

export async function loginUser(email: string, password: string) {
	const {
		data: { user },
		error
	} = await supabase.auth.signInWithPassword({
		email,
		password
	});
	if (error) {
		showMessage(error.message);
		return;
	}
	const { error: error2 } = await supabase
		.from('user_info')
		.select('type')
		.eq('user', user?.id)
		.eq('type', 'doctor')
		.single();

	if (error2) {
		showMessage("vous n'estes pas un médecin");
		await supabase.auth.signOut();
		return;
	}
	showMessage('Connecté ! 🎉');
	fetchCurrentUser();
}

export async function logoutUser() {
	const { error } = await supabase.auth.signOut();
	if (!error) {
		storeCurrentUser.set(null);
		showMessage('Déconnecté ! 🎉');
		return;
	}
	showMessage(error.message);
	fetchCurrentUser();
}

export async function getDoctorAppointment(): Promise<
	Array<
		Database['public']['Tables']['appointment']['Row'] & {
			doctor: Database['public']['Tables']['user_info']['Row'];
		}
	>
> {
	const { data, error } = await supabase
		.from('appointment')
		.select('*, patient (*)')
		.order('date', { ascending: true });
	if (error) {
		showMessage(error.message);
		return [];
	}
	return data as any;
}

export async function fetchCurrentUser() {
	if (get(storeCurrentUser) !== null) {
		return;
	}
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (error) {
		storeCurrentUser.set(null);
		showMessage(error.message);
		return;
	}
	// get the user info of the current user logged in
	const { data } = await supabase.from('user_info').select('*').eq('user', user?.id).single();
	if (error) {
		storeCurrentUser.set(null);
		showMessage(error);
		return;
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	storeCurrentUser.set({ data: data!, user: user! });
}

export async function deleteAppointment(id: string) {
	const { error } = await supabase.from('appointment').delete().eq('id', id);
	if (error) {
		showMessage(error.message);
		return;
	}
	showMessage('Rendez-vous supprimé !');
}

export async function sendMail(
	appointment: Database['public']['Tables']['appointment']['Row'] & {
		patient: Database['public']['Tables']['user_info']['Row'];
	}
) {
	const doctor = get(storeCurrentUser);
	window.location.assign(
		`mailto:${appointment.patient.email}?subject=Votre rendez-vous ${
			appointment.name
		}&body=${encodeURIComponent(
			`Bonjour ${appointment.patient.firstName},\n\nvotre rendez-vous est prévu le ${appointment.date}\n\n Cordialement,\n\n Dr. ${doctor.data.firstName} ${doctor.data.name}`
		)}`
	);
}
