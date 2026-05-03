import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { user } = locals;
	if (!user.isApproved) {
		throw redirect(303, '/contributor/dashboard');
	}
};
