import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			// Better Auth akan mengelola set-cookie secara otomatis di header response
			await auth.api.signInEmail({
				body: { email, password }
			});
		} catch (error: any) {
			return fail(400, { message: 'Email atau password salah' });
		}

		throw redirect(302, '/dashboard');
	}
};
