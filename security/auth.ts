import UserPool from "./data/UserPool";
import {CognitoUserSession} from "amazon-cognito-identity-js";

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