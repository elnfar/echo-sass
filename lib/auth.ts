import { getServerSession,Session } from "next-auth"
import { JWT } from "next-auth/jwt"

export type AuthUser = {
    name: string
    email: string
    image: string
}

type SessionParams = {
    session:Session,
    token:JWT
}

export const session = async ({session,token}:SessionParams) => {
    session.user.id = token.id
    session.user.tenant = token.tenant

    return session
}

export const getUserSession = async():Promise<AuthUser> => {

    const authUserSession = await getServerSession({
        callbacks:{
            session
        }
    });
    if(!authUserSession) {
        throw new Error('Unauthorized')
    }
    return authUserSession.user as AuthUser
}