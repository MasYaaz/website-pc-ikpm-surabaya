import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (user?.status == 'active') {
		throw redirect(303, '/contributor/dashboard');
	}
	return { user };
};
