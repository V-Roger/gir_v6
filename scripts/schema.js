import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core'

export const photos = pgTable('photos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  path: varchar(),
  description: text(),
  order: integer(),
})

export const galleries = pgTable('galleries', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar(),
  name: varchar(),
  description: text(),
  photos: integer()
    .references(() => photos.id)
    .array(),
  cover: integer().references(() => photos.id),
  order: integer(),
}) 