import { galleries, photos } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ params }: { params: { slug: string } }) => {
	const galleryName = params.slug;

	const gallery = await db.select().from(galleries).where(eq(galleries.slug, galleryName)).limit(1);
	const galleryPhotos = await db.select().from(photos).where(inArray(photos.id, gallery?.[0]?.photos ?? []));

	return { gallery: gallery?.[0], photos: galleryPhotos.map(p => ({ path: p.path, description: p.description })) ?? [] };
};