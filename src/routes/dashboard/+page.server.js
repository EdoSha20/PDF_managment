import { redirect } from '@sveltejs/kit';


export async function load({ locals }) {

	// Ohne Login darf Dashboard
	// nicht geöffnet werden
	if (!locals.user) {

		redirect(
			303,
			'/login'
		);
	}


	return {
		user: locals.user,
		pdfs: []
	};
}