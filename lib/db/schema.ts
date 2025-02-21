import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const images = sqliteTable('images', {
  id: integer('id').primaryKey(),
  filename: text('filename').notNull(),
  key: text('key').notNull().default(""),
  url: text('url').notNull(),
  contentType: text('content_type').notNull(),
  bytes: integer('bytes').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type Image = typeof images.$inferSelect 