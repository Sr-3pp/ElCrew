export interface registerPayload{
    username: string
    email: string
    password: string
    isTeacher: boolean
    callbackURL: string
}

export interface loginPayload{
    email: string
    password: string
    callbackURL: string
}

export interface AuthProfile {
    id: string
    userId: string
    contact: string | null
    quote: string | null
    bio: string | null
    favoriteTricks: string | null
    areaOfFocus: string | null
    name: string | null
    lastName: string | null
    dob: string | null
    picture: string | null
    createdAt: string | null
    updatedAt: string | null
}

export interface AuthUser {
    id: string
    name?: string
    username?: string
    email: string
    emailVerified: boolean
    isAdmin: boolean
    isTeacher: boolean
    createdAt: string | null
    updatedAt: string | null
    profile: AuthProfile | null
}

export interface AuthSessionResponse {
    session: {
        id: string
        userId: string
        expiresAt: string
        createdAt: string | null
        updatedAt: string | null
    }
    user: AuthUser
}
