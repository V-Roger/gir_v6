import { db } from '$lib/server/db'
import { galleries } from '$lib/server/db/schema'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
  return { galleries: await db.select().from(galleries) }
}
