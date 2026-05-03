import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = locals.user; // Data dari hooks + Netlify Blobs
	const isLoggedIn = !!user;
	const pathname = url.pathname;

	// --- LOGIKA REDIRECT ---

	// 1. Jika akses root '/contributor', arahkan ke dashboard atau login
	if (pathname === '/contributor' || pathname === '/contributor/') {
		if (!isLoggedIn) {
			throw redirect(302, '/contributor/login');
		}
		throw redirect(302, '/contributor/dashboard');
	}

	// 2. Proteksi Grup Rute Internal (/dashboard, /posts, /options)
	const isInternalRoute =
		pathname.startsWith('/contributor/dashboard') ||
		pathname.startsWith('/contributor/posts') ||
		pathname.startsWith('/contributor/options');

	if (isInternalRoute) {
		if (!isLoggedIn) {
			throw redirect(302, '/contributor/login');
		}

		// Validasi status akun dari cache/DB
		if (user.status === 'nonactive') {
			throw redirect(302, '/contributor/onboarding');
		}
	}

	// 3. Proteksi Halaman Auth (Login/Registrasi)
	const isAuthPage = pathname.endsWith('/login') || pathname.endsWith('/registrasi');
	if (isAuthPage && isLoggedIn) {
		throw redirect(302, '/contributor/dashboard');
	}

	return {
		user
	};
};
