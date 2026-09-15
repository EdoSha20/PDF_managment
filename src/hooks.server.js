import {
	getUserFromSession
} from '$lib/server/auth.js';


export async function handle({ event, resolve }) {

	// Session Cookie lesen
	const token =
		event.cookies.get('session');


	// Eingeloggten User suchen
	const user =
		await getUserFromSession(token);


	// User für serverseitige Routes speichern
	event.locals.user = user;


	return resolve(event);
}