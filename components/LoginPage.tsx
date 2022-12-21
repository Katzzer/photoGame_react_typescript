import React, {useEffect, useState} from 'react';
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute, CognitoUserSession,
} from "amazon-cognito-identity-js";
import UserPool from "../security/data/UserPool"
import jwtDecode from "jwt-decode";
import axios from "axios";

interface jwtTokenIdType {
    "aud": string,
    "auth_time": string,
    "cognito:username" : string,
    "email": string,
    "email:verified": string,
    "event_id": string,
    "exp": Date,
    "iat": Date,
    "iss": string,
    "jti": string,
    "name": string,
    "sub": string,
    "token_use": string,
}

function LoginPage() {
    const [username, setUsername] = useState("katzz");
    const [email, setEmail] = useState("katzz@seznam.cz");
    const [password, setPassword] = useState("Monitor11!");
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [loggedUserUsername, setLoggedUserUsername] = useState("");
    const [idToken, setIdToken] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [messageFromBackend, setMessageFromBackend] = useState("");

    useEffect(() => {
        getSession()
            .then((session:CognitoUserSession | unknown ) => {
                console.log(session);
                if (session instanceof CognitoUserSession) {
                    setIsUserLogged(true);
                    setLoggedUserUsername(session.getAccessToken().payload.username);
                    setIdToken(session.getIdToken().getJwtToken());
                    setAccessToken(session.getAccessToken().getJwtToken());
                    setRefreshToken(session.getRefreshToken().getToken());
                }
                
            }).catch(() => {
                console.log("user is not logged");
                setIsUserLogged(false);
                setLoggedUserUsername("");
                setIdToken("");
                setAccessToken("");
                setRefreshToken("");
                
        });
    }, [])

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

    function onSubmit (event: React.FormEvent) {
        event.preventDefault();

        const attributesToBeAdded = [
            {
                Name: "name",
                Value: username,
            },
            {
                Name: "email",
                Value: email,
            },
        ];


        const attrList: Array<CognitoUserAttribute> = attributesToBeAdded.map(
            attr => {
                return new CognitoUserAttribute(attr);
            }
        );

        UserPool.signUp(username, password, attrList, [], (err, data) => {
                if (err) {
                    console.log(err)
                } else if (data?.user) {
                    console.log(data);
                    setIsUserLogged(true);
                    setLoggedUserUsername(data?.user.getUsername())
                }

               
            }
        )
    }

    function onLogin (event: React.FormEvent) {
        event.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: ", data);
                setIsUserLogged(true);
                const jwtToken = data.getIdToken().getJwtToken();
                const jwtDecoded:jwtTokenIdType = jwtDecode(jwtToken);
                console.log(jwtDecoded)
                console.log(jwtDecoded["cognito:username"])
                setLoggedUserUsername(jwtDecoded.name)
            },
            onFailure: (err) => {
                console.log("on Failure ", err);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: ",  data);
            },
        })
    }

    function logout() {
        console.log("logging user out")
        const user = UserPool.getCurrentUser();
        console.log(user)
        setIsUserLogged(false);
        setLoggedUserUsername("");
        if (user) {
            user.signOut();
        }

    }
    
    async function sendRequestToBackend() {
        const config = {
            headers: { Authorization: `Bearer ${idToken}` }
        };

        const response = await axios.get("http://localhost:8080/api/v1/data", config);
        console.log(response.data);
        setMessageFromBackend(response.data);
    }
    
    return (
        <div>
            <h1>Welcome at Login page</h1>

            {!isUserLogged && (<>
                <h1>SignUp or LogIn</h1>

                <div>
                    <label htmlFor="cognito-simple__username">Email:</label>
                    <input id="cognito-simple__username" type={"text"} value={username} onChange={(event) => setUsername(event.target.value)}/>
                </div>

                <div>
                    <label htmlFor="cognito-simple__email">Email:</label>
                    <input id="cognito-simple__email" type={"text"} value={email} onChange={(event) => setEmail(event.target.value)}/>
                </div>

                <div>
                    <label htmlFor="cognito-simple__password">Password</label>
                    <input id="cognito-simple__password" type={"password"} value={password} onChange={(event) => setPassword(event.target.value)}/>
                </div>


                <button onClick={onSubmit}>Sign up</button>

                <h1>LogIn</h1>

                <div>
                    <label htmlFor="cognito__email">Email:</label>
                    <input id="email" type={"text"} value={email} onChange={(event) => setEmail(event.target.value)}/>
                </div>

                <div>
                    <label htmlFor="cognito__password">Password</label>
                    <input id="cognito__password" type={"password"} value={password} onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <button onClick={onLogin}>LogIn</button>
            </>)}

            {isUserLogged && (<>
                <h1>Welcome {loggedUserUsername}</h1>

                <button onClick={logout}>Logout</button>
                
                <div>
                    <br/>
                    <button onClick={sendRequestToBackend}>Send request to backend</button>
                    <br/>
                    <br/>
                    <div>Message from backend = {messageFromBackend}</div>
                    <br/>
                    <div>idToken = {idToken}</div>
                    <br/>
                    <div>accessToken = {accessToken}</div>
                    <br/>
                    <div>refreshToken = {refreshToken}</div>
                </div>
                
            </>)}
            
        </div>
    );
}

export default LoginPage;