import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { getStore } from '@netlify/blobs';

const handleSupabaseAuth: Handle = async ({ event, resolve }) => {
	const url = event.url.pathname;

	// Skip static assets
	if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|ico|woff2)$/) || url.startsWith('/fonts')) {
		return resolve(event);
	}

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll().map(({ name, value }) => ({
					name,
					value: value ?? ''
				}));
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						path: options.path ?? '/'
					});
				});
			}
		}
	});

	const isAuthRoute =
		event.url.pathname.startsWith('/admin') ||
		event.url.pathname.startsWith('/api') ||
		event.url.pathname.startsWith('/contributor');

	if (isAuthRoute) {
		// 1. Cek session dari cookie (cepat)
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		let authUser = session?.user ?? null;

		// 2. Jika session tidak ada/invalid, validasi ulang ke server Supabase
		if (!authUser) {
			const {
				data: { user }
			} = await event.locals.supabase.auth.getUser();
			authUser = user;
		}

		if (authUser) {
			const meta = authUser.user_metadata;
			const cacheKey = `profile-${authUser.id}`;
			const profileStore = getStore('user-profiles');

			// 3. Cek Cache di Netlify Blobs
			let profileData = await profileStore.get(cacheKey, { type: 'json' });

			// 4. Jika cache kosong/expired (lewat 10 menit), ambil dari Database
			if (!profileData) {
				const { data: profile } = await event.locals.supabase
					.from('profiles')
					.select('role, avatar_url, status')
					.eq('id', authUser.id)
					.single();

				if (profile) {
					profileData = profile;
					// Simpan ke cache Blobs dengan TTL 10 menit
					await profileStore.setJSON(cacheKey, profile, {
						metadata: { expires: Date.now() + 10 * 60 * 1000 }
					});
				}
			}

			event.locals.user = {
				id: authUser.id,
				email: authUser.email ?? '',
				displayName: meta?.display_name ?? '',
				role: profileData?.role ?? meta?.role ?? 'contributor',
				status: profileData?.status ?? 'nonactive',
				avatar_url: profileData?.avatar_url ?? null
			};
		} else {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const response = await resolve(event);

	// Security headers
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};

export const handle: Handle = handleSupabaseAuth;
