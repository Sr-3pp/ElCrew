import type { useDrizzle } from '~~/server/utils/drizzle'

type DB = ReturnType<typeof useDrizzle>

const profileColumns = [
  { name: 'quote', definition: 'text' },
  { name: 'bio', definition: 'text' },
  { name: 'favorite_tricks', definition: 'text' },
  { name: 'area_of_focus', definition: 'text' },
] as const

let ensuredProfileSchemaPromise: Promise<void> | null = null

export async function ensureProfileSchema(db: DB) {
  if (!ensuredProfileSchemaPromise) {
    ensuredProfileSchemaPromise = ensureProfileSchemaInternal(db).catch((error) => {
      ensuredProfileSchemaPromise = null
      throw error
    })
  }

  await ensuredProfileSchemaPromise
}

async function ensureProfileSchemaInternal(db: DB) {
  const tableInfo = await db.all<{ name: string }>("PRAGMA table_info('profiles')")
  const existingColumns = new Set(tableInfo.map(column => column.name))

  for (const column of profileColumns) {
    if (existingColumns.has(column.name)) {
      continue
    }

    await db.run(`ALTER TABLE profiles ADD COLUMN ${column.name} ${column.definition}`)
  }
}
