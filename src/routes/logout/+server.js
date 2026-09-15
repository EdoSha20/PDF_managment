import {
	deleteSession
} from '$lib/server/auth.js';

import {
	redirect
} from '@sveltejs/kit';


export async function POST({
	cookies
}) {

	const token =
		cookies.get('session');


	// Session aus Datenbank löschen
	await deleteSession(token);


	// Cookie löschen
	cookies.delete(
		'session',
		{
			path: '/'
		}
	);


	redirect(
		303,
		'/login'
	);
}