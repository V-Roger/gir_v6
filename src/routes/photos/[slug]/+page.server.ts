import { galleries, photos } from '$lib/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'

async function fetchGallery(slug: string) {
  const gallery = await db.select().from(galleries).where(eq(galleries.slug, slug)).limit(1)
  const galleryPhotos = await db
    .select()
    .from(photos)
    .where(inArray(photos.id, gallery?.[0]?.photos ?? []))
    .orderBy(photos.order)

  return {
    gallery: gallery?.[0],
    photos: galleryPhotos.map((p) => ({ path: p.path, description: p.description })) ?? [],
  }
}

export const load: PageServerLoad = async ({ params }: { params: { slug: string } }) => {
  return await fetchGallery(params.slug)
}
