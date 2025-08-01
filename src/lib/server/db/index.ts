import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const dbUrl = env.NETLIFY_DATABASE_URL ?? env.DATABASE_URL;

if (!dbUrl) throw new Error('no DATABASE_URL nor NETLIFY_DATABASE_URL set');

const client = neon(dbUrl);

export const db = drizzle(client, { schema });
