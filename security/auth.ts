import UserPool from "./data/UserPool";
import {CognitoUserSession} from "amazon-cognito-identity-js";

// export async function isValidSession() {
//     try{
//         const session = await getSession();
//         debugger;
//         return Boolean(session);
//     } catch(error) {
//         console.error(error);
//         return false;
//     }
// }

export default async function getSessionAndVerify(): Promise<CognitoUserSession | null> {
    try {
        const session = await getSession();
        console.log(session);
        if (session instanceof CognitoUserSession) {
            return session;
        } else {
            return null;
        }
    } catch (err) {
        // console.error('Failed to verify session:', err);
        return null;
    }

}

async function getSession() {
    return await new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser();

        if (user) {
            user.getSession((err: any, session: CognitoUserSession) => {
                if (err) {
                    reject();
                } else {
                    resolve(session);
                }
            });
        } else {
            reject();
        }
    });
}