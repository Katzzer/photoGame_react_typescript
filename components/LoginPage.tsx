import React, {useEffect, useState} from 'react';
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import UserPool from "../security/data/UserPool"
import jwtDecode from "jwt-decode";

interface jwtTokenId {
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

    useEffect(() => {
        checkIfUserIsLogged()
    }, [])

    function checkIfUserIsLogged() {
        console.log("checking user")
        const user = UserPool.getCurrentUser();
        if (user != null) {
            console.log(user.getUsername())
            setIsUserLogged(true);
            setLoggedUserUsername(user.getUsername())
        } else {
            setIsUserLogged(false);
            setLoggedUserUsername("");
        }

    }

    const onSubmit = (event: React.FormEvent) => {
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

    const onLogin = (event: React.FormEvent) => {
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
                const jwtDecoded:jwtTokenId = jwtDecode(jwtToken);
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
    
    return (
        <div>
            <h1>Welcome at Login page</h1>

            {!isUserLogged && (<>
                <h1>SignUp</h1>

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
            </>)}
            
        </div>
    );
}

export default LoginPage;