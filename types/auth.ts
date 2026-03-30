export interface registerPayload{
    name: string
    email: string
    password: string
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
    name: string | null
    lastName: string | null
    dob: string | null
    picture: string | null
    createdAt: string
    updatedAt: string
}

export interface AuthUser {
    id: string
    username: string
    email: string
    emailVerified: boolean
    isAdmin: boolean
    isTeacher: boolean
    createdAt: string
    updatedAt: string
    profile: AuthProfile | null
}

export interface AuthSessionResponse {
    session: {
        id: string
        userId: string
        expiresAt: string
        createdAt: string
        updatedAt: string
    }
    user: AuthUser
}
