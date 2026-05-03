import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// 1. Ambil session dari Better Auth
	const { user } = locals;
	const searchQuery = url.searchParams.get('q') || '';
	return {
		user,
		searchQuery
	};
};
