import type { H3Event } from 'h3'
import { blob, ensureBlob } from 'hub:blob'

type TeacherFormValues = {
  username: string
  email: string
  password?: string
  name: string
  lastName: string
  dob: string
  quote: string | null
  bio: string | null
  favoriteTricks: string | null
  areaOfFocus: string | null
  contact: string | null
  pictureFile: File | null
}

function getStringEntry(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getOptionalStringEntry(formData: FormData, key: string) {
  const value = getStringEntry(formData, key)
  return value || undefined
}

function getFileEntry(formData: FormData, key: string) {
  const value = formData.get(key)

  if (!(value instanceof File) || !value.size) {
    return null
  }

  return value
}

export async function readTeacherForm(event: H3Event): Promise<TeacherFormValues> {
  const formData = await readFormData(event)

  return {
    username: getStringEntry(formData, 'username'),
    email: getStringEntry(formData, 'email'),
    password: getOptionalStringEntry(formData, 'password'),
    name: getStringEntry(formData, 'name'),
    lastName: getStringEntry(formData, 'lastName'),
    dob: getStringEntry(formData, 'dob'),
    quote: getOptionalStringEntry(formData, 'quote') || null,
    bio: getOptionalStringEntry(formData, 'bio') || null,
    favoriteTricks: getOptionalStringEntry(formData, 'favoriteTricks') || null,
    areaOfFocus: getOptionalStringEntry(formData, 'areaOfFocus') || null,
    contact: getOptionalStringEntry(formData, 'contact') || null,
    pictureFile: getFileEntry(formData, 'picture'),
  }
}

export async function uploadTeacherPicture(userId: string, pictureFile: File) {
  ensureBlob(pictureFile, {
    maxSize: '1MB',
    types: ['image'],
  })

  const blobObject = await blob.put(pictureFile.name || 'teacher-picture', pictureFile, {
    addRandomSuffix: true,
    contentType: pictureFile.type || undefined,
    prefix: `teachers/${userId}`,
  })

  return `/blob/${blobObject.pathname}`
}

function getBlobPathname(pictureUrl: string) {
  const normalized = pictureUrl.trim()

  if (!normalized) {
    return null
  }

  if (normalized.startsWith('/blob/')) {
    return normalized.slice('/blob/'.length)
  }

  try {
    const url = new URL(normalized)

    if (url.pathname.startsWith('/blob/')) {
      return url.pathname.slice('/blob/'.length)
    }
  } catch {
    return null
  }

  return null
}

export async function deleteTeacherPicture(pictureUrl: string | null | undefined) {
  if (!pictureUrl) {
    return
  }

  const pathname = getBlobPathname(pictureUrl)

  if (!pathname) {
    return
  }

  await blob.delete(pathname)
}
