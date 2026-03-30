import { eq, tables, useDrizzle } from '~~/server/utils/drizzle';
import { requireAuthSession } from '~~/server/utils/requireSession';

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const db = useDrizzle();

  const [existingProfile] = await db
    .select()
    .from(tables.Profile)
    .where(eq(tables.Profile.userId, session.user.id))
    .limit(1);

  if (existingProfile) {
    return existingProfile;
  }

  const [profile] = await db
    .insert(tables.Profile)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
    })
    .returning();

  if (!profile) {
    throw createError({
      status: 500,
      statusText: 'Profile could not be created',
    });
  }

  return profile;
});
