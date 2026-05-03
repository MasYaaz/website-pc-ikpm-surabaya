import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const name = formData.get('name') as string;

		// 1. Validasi Input
		if (!email || !password || !name) {
			return fail(400, { message: 'Semua field wajib diisi' });
		}

		// 2. Proses Pendaftaran ke Supabase Auth
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				// Menyimpan nama ke user_metadata agar bisa diakses di locals.user
				data: {
					display_name: name,
					role: 'contributor' // Default role sesuai skema tabel user kamu
				}
			}
		});

		if (error) {
			return fail(400, { message: error.message || 'Gagal mendaftar' });
		}

		const user = data.user;
		const displayName = user.user_metadata?.display_name;

		return { success: true, message: `Login berhasil, Selamat Datang ${displayName}!` };
	}
};
