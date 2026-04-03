import type { TeacherPayload } from '~~/types/teacher'

export const toTeacherFormData = (payload: TeacherPayload) => {
    const formData = new FormData()

    formData.append('username', payload.username)
    formData.append('email', payload.email)

    if (payload.password) {
        formData.append('password', payload.password)
    }

    formData.append('name', payload.name)
    formData.append('lastName', payload.lastName)
    formData.append('dob', payload.dob)

    if (payload.quote) {
        formData.append('quote', payload.quote)
    }

    if (payload.bio) {
        formData.append('bio', payload.bio)
    }

    if (payload.favoriteTricks) {
        formData.append('favoriteTricks', payload.favoriteTricks)
    }

    if (payload.areaOfFocus) {
        formData.append('areaOfFocus', payload.areaOfFocus)
    }

    if (payload.contact) {
        formData.append('contact', payload.contact)
    }

    const picture = Array.isArray(payload.picture) ? payload.picture[0] : payload.picture

    if (picture instanceof File) {
        formData.append('picture', picture)
    }

    return formData
}

export const parseContact = (contact: string | null | undefined) => {
    if (!contact) {
        return {
            whatsapp: '',
            instagram: '',
            tiktok: '',
        }
    }

    try {
        const parsed = JSON.parse(contact) as Record<string, unknown>

        return {
            whatsapp: typeof parsed.whatsapp === 'string' ? parsed.whatsapp : '',
            instagram: typeof parsed.instagram === 'string' ? parsed.instagram : '',
            tiktok: typeof parsed.tiktok === 'string' ? parsed.tiktok : '',
        }
    } catch {
        return {
            whatsapp: '',
            instagram: '',
            tiktok: '',
        }
    }
}

export const parseFavoriteTricks = (favoriteTricks: string | null | undefined) => {
    if (!favoriteTricks) {
        return []
    }

    return favoriteTricks
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
}
