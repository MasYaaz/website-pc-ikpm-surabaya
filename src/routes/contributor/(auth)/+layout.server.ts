import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { user } = locals;
	if (!user) {
		throw redirect(303, '/contributor/login');
	}
	return { user };
};
