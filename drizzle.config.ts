import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.NETLIFY_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) throw new Error('no DATABASE_URL nor NETLIFY_DATABASE_URL set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: dbUrl },
	verbose: true,
	strict: true
});
