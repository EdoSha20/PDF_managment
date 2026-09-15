import crypto from 'node:crypto';
import { db } from '$lib/server/database.js';

const SESSION_DAYS = 7;


// Neue Session erstellen
export async function createSession(userId) {

	const token = crypto
		.randomBytes(32)
		.toString('hex');


	// Token nicht direkt in DB speichern
	const tokenHash = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');


	const expiresAt = new Date(
		Date.now() +
		SESSION_DAYS * 24 * 60 * 60 * 1000
	);


	await db.execute(
		`
		INSERT INTO sessions
		(token_hash, user_id, expires_at)

		VALUES (?, ?, ?)
		`,
		[tokenHash, userId, expiresAt]
	);


	return {
		token,
		expiresAt
	};
}


// User anhand der Session finden
export async function getUserFromSession(token) {

	if (!token) {
		return null;
	}


	const tokenHash = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');


	const [rows] = await db.execute(
		`
		SELECT
			users.id,
			users.username,
			users.role

		FROM sessions

		JOIN users
			ON users.id = sessions.user_id

		WHERE sessions.token_hash = ?
		AND sessions.expires_at > NOW()

		LIMIT 1
		`,
		[tokenHash]
	);


	if (rows.length === 0) {
		return null;
	}


	return rows[0];
}


// Session beim Logout löschen
export async function deleteSession(token) {

	if (!token) {
		return;
	}


	const tokenHash = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');


	await db.execute(
		`
		DELETE FROM sessions
		WHERE token_hash = ?
		`,
		[tokenHash]
	);
}