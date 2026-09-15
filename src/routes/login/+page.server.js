import { db } from '$lib/server/database.js';
import { createSession } from '$lib/server/auth.js';

import bcrypt from 'bcryptjs';

import {
	fail,
	redirect
} from '@sveltejs/kit';

import { dev } from '$app/environment';


export function load({ locals }) {

	// Bereits eingeloggt
	if (locals.user) {
		redirect(303, '/dashboard');
	}
}


export const actions = {

	default: async ({ request, cookies }) => {

		const formData =
			await request.formData();


		const username =
			String(
				formData.get('username') ?? ''
			).trim();


		const password =
			String(
				formData.get('password') ?? ''
			);


		// Eingaben prüfen
		if (!username || !password) {

			return fail(400, {
				error:
					'Bitte Benutzername und Passwort eingeben.'
			});
		}


		// User suchen
		const [rows] = await db.execute(
			`
			SELECT
				id,
				username,
				password_hash,
				role

			FROM users

			WHERE username = ?

			LIMIT 1
			`,
			[username]
		);


		if (rows.length === 0) {

			return fail(400, {
				error:
					'Benutzername oder Passwort ist falsch.'
			});
		}


		const user = rows[0];


		// Passwort prüfen
		const passwordCorrect =
			await bcrypt.compare(
				password,
				user.password_hash
			);


		if (!passwordCorrect) {

			return fail(400, {
				error:
					'Benutzername oder Passwort ist falsch.'
			});
		}


		// Session erstellen
		const {
			token,
			expiresAt
		} = await createSession(user.id);


		// Cookie setzen
		cookies.set(
			'session',
			token,
			{
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: !dev,
				expires: expiresAt
			}
		);


		redirect(303, '/dashboard');
	}
};