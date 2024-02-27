import React, {useContext, useState} from 'react';
import TokenContext from "../context/token-context";
import getSessionAndVerify from "../security/auth";
import {ActionType, State} from "../model/token.model";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import UserPool from "../security/data/UserPool";
import axios from "axios";
import {BACKEND_URL} from "../tools/constants";
import {useNavigate} from "react-router-dom";
import {PageUrl} from "../tools/RouterEnum";

interface PropsType {
    setIsUserLogged: (isUserLogged: boolean) => void
    setLoggedUserUsername: (loggedUserUsername: string | null) => void
    setToken: (actionType: ActionType, tokens: Partial<State>) => void
}

function Login(props:PropsType) {
    const [state, _] = useContext(TokenContext);
    const [username, setUsername] = useState("katzz");
    const [email, setEmail] = useState("katzz@seznam.cz");
    const [password, setPassword] = useState("Monitor11!");
    const [messageFromBackend, setMessageFromBackend] = useState(""); // TODO: only for testing:
    const [isShownLoginForm, setIsShownLoginForm] = useState(true);
    const navigate = useNavigate();

    const renderSpans = Array.from({length: 50}, (_, index) => {
        return <AnimatedSpan key={index} value={index}/>;
    });

    function checkLoggedUser() {
        getSessionAndVerify().then(session => {
            if (session) {
                props.setIsUserLogged(true);
                props.setLoggedUserUsername(session.getAccessToken().payload.username);
                props.setToken(ActionType.SET_ID_TOKEN, {idToken: session.getIdToken().getJwtToken()});
                props.setToken(ActionType.SET_ACCESS_TOKEN, {accessToken: session.getAccessToken().getJwtToken()});
                props.setToken(ActionType.SET_REFRESH_TOKEN, {refreshToken: session.getRefreshToken().getToken()});
                navigate(PageUrl.MENU);
            } else {
                console.log("user is not logged");
                props.setIsUserLogged(false);
                props.setLoggedUserUsername("");
                props.setToken(ActionType.SET_ID_TOKEN, {idToken: null})
                props.setToken(ActionType.SET_ACCESS_TOKEN, {accessToken: null})
                props.setToken(ActionType.SET_REFRESH_TOKEN, {refreshToken: null})
            }
        })
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
                    props.setIsUserLogged(true);
                    props.setLoggedUserUsername(data?.user.getUsername())
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
                checkLoggedUser();
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
        props.setIsUserLogged(false);
        props.setLoggedUserUsername(null);
        props.setToken(ActionType.SET_ID_TOKEN, {idToken: null})
        props.setToken(ActionType.SET_ACCESS_TOKEN, {accessToken: null})
        props.setToken(ActionType.SET_REFRESH_TOKEN, {refreshToken: null})
        if (user) {
            user.signOut();
        }
    }

    function toggleLoginAndSignupForm() {
        setIsShownLoginForm(!isShownLoginForm);
    }

    // TODO: remove when not needed
    function copyIdTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.idToken);
    }

    // TODO: remove when not needed
    function copyAccessTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.accessToken);
    }

    // TODO: remove when not needed
    function copyRefreshTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.refreshToken);
    }

    // TODO: remove when not needed
    async function sendTestingRequestToBackend() {
        const config = {
            headers: { Authorization: `Bearer ${state.idToken}` }
        };

        const response= await axios.get(BACKEND_URL.LOCALHOST, config);
        console.log(response.data);
        setMessageFromBackend(response.data);
    }

    return (
        <>
            {!state.isUserLogged && (<>
                <div className="login__container">

                    {isShownLoginForm && <div className="login__box">
                        <h2>Login</h2>
                        <form action="#">
                            <div className="login__input-box">
                                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                                <label>Email</label>
                            </div>
                            <div className="login__input-box">
                                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                                <label>Password</label>
                            </div>
                            <div className="login__forgot-pass">
                                <a href="#">Forgot your password?</a>
                            </div>
                            <button onClick={onLogin} className="login__btn">Login</button>
                            <div className="login__signup-login-link" onClick={toggleLoginAndSignupForm}>Signup</div>
                        </form>
                    </div> }

                    {!isShownLoginForm && <div className="login__box">
                        <h2>Login</h2>
                        <form action="#">
                            <div className="login__input-box">
                                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required/>
                                <label>Email</label>
                            </div>
                            <div className="login__input-box">
                                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                                <label>Email</label>
                            </div>
                            <div className="login__input-box">
                                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                                <label>Password</label>
                            </div>
                            <div className="login__forgot-pass">
                                <a href="#">Forgot your password?</a>
                            </div>
                            <button onClick={onSubmit} className="login__btn">Signup</button>
                            <div className="login__signup-login-link" onClick={toggleLoginAndSignupForm}>Log in</div>
                        </form>
                    </div>}

                    {renderSpans}
                </div>
            </>)}

            {/*TODO: redirect to another page: */}
            {state.isUserLogged && (<>
                <div className="login__container-testing">
                    <h1>Welcome {state.loggedUserUsername}</h1>

                    <button onClick={logout}>Logout</button>

                    <div>
                        <br/>
                        <button onClick={sendTestingRequestToBackend}>Send testing request to backend</button>
                        <br/>
                        <br/>
                        {messageFromBackend && <div>Message from backend = {messageFromBackend}</div>}
                        <br/>
                        <br/>
                        <div className={"tokenInfo"}>idToken = {state.idToken}</div>
                        <button onClick={copyIdTokenToClipboard}>Copy idToken</button>
                        <br/>
                        <br/>
                        <div className={"tokenInfo"}>accessToken = {state.accessToken}</div>
                        <button onClick={copyAccessTokenToClipboard}>Copy access token</button>
                        <br/>
                        <br/>
                        <div className={"tokenInfo"}>refreshToken = {state.refreshToken}</div>
                        <button onClick={copyRefreshTokenToClipboard}>Copy access token</button>
                        <br/>
                        <br/>
                        <br/>

                        <br/>
                        <br/>

                    </div>

                </div>
            </>)}
        </>
    );
}

export default Login;

interface AnimatedSpanProps {
    value: number;
}

function AnimatedSpan({value}: AnimatedSpanProps) {
    return <span style={{'--i': value} as React.CSSProperties}></span>;
}