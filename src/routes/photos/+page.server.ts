import { db } from '$lib/server/db'
import { galleries, photos } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

async function hydrateCoverPhotos(galleriesList: (typeof galleries.$inferSelect & { photos: number[] | null })[]) {
  return Promise.all(
    galleriesList.map(async (gallery) => {
      if (!gallery?.photos?.length) {
        return { ...gallery, cover: undefined }
      }

      const cover = await db
        .select()
        .from(photos)
        .where(eq(photos.id, gallery.cover ?? gallery.photos[0]))

      return { ...gallery, cover: cover?.[0] ?? undefined }
    }),
  )
}

async function fetchGalleriesWithCover() {
  const galleriesList = await db.select().from(galleries).orderBy(galleries.order)
  if (galleriesList.length === 0) {
    return []
  }

  return await hydrateCoverPhotos(galleriesList)
}

export const load: PageServerLoad = async () => {
  return { galleries: await fetchGalleriesWithCover() }
}
