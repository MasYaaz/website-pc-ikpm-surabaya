import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async () => {
	throw redirect(302, '/contributor/login');
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const { user, supabase } = locals;
		const displayName = user?.displayName;
		// @supabase/ssr akan otomatis menangani penghapusan cookie lewat headers
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500, {
				message: 'Gagal logout secara sistem, silakan coba lagi.',
				type: 'error'
			});
		}

		// Infoin berhasil atau langsung redirect
		// SvelteKit akan mengirimkan headers set-cookie untuk menghapus session
		return {
			message: `Logout berhasil, sampai jumpa ${displayName}!`,
			type: 'success'
		};
	}
};
