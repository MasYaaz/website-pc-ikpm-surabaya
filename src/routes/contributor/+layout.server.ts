import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// 1. Ambil data user dari locals (sudah di-set oleh hooks)
	const user = locals.user;
	const isLoggedIn = !!user;

	const pathname = url.pathname;

	// --- LOGIKA REDIRECT ---

	// A. Jika akses root '/contributor', arahkan berdasarkan status login
	if (pathname === '/contributor' || pathname === '/contributor/') {
		if (!isLoggedIn) {
			throw redirect(302, '/contributor/login');
		} else {
			throw redirect(302, '/contributor/dashboard');
		}
	}

	// B. Proteksi Dashboard: Jika belum login tapi coba akses /dashboard
	// Catatan: Sebaiknya proteksi ini juga ada di hooks agar lebih aman
	if (pathname.startsWith('/contributor/dashboard') && !isLoggedIn) {
		throw redirect(302, '/contributor/login');
	}

	// C. Proteksi Auth Pages: Jika SUDAH login tapi coba akses /login atau /registrasi
	const isAuthPage = pathname.includes('/login') || pathname.includes('/registrasi');
	if (isAuthPage && isLoggedIn) {
		throw redirect(302, '/contributor/dashboard');
	}

	// Kirim data user ke layout agar bisa dipakai UI (Navbar, Sidebar, dll)
	return {
		user
	};
};
