import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// 1. Validasi input sederhana
		if (!email || !password) {
			return fail(400, { message: 'Email dan password wajib diisi' });
		}

		// 2. Proses Login menggunakan Supabase Auth
		// Supabase secara otomatis mengelola session dan set-cookie di browser
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			// Memberikan pesan error yang lebih spesifik jika diperlukan
			// Supabase error message biasanya sudah cukup jelas (misal: Invalid login credentials)
			return fail(400, { message: 'Email atau password salah' });
		}

		const user = data.user;
		const displayName = user.user_metadata?.display_name;

		return { success: true, message: `Login berhasil, Selamat Datang ${displayName}!` };
	}
};
