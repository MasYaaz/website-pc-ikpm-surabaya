import { error } from '@sveltejs/kit';

/**
 * Memastikan user sudah login. Jika tidak, lempar error 401.
 * @param locals - Diambil dari RequestEvent SvelteKit
 * @returns session data jika berhasil
 */
export async function requireAuth(locals: App.Locals) {
	const { user } = locals;

	if (!user) {
		throw error(401, { message: 'Unauthorized: Silakan login terlebih dahulu.' });
	}

	return { user };
}
