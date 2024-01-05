import React, {useContext, useEffect, useReducer, useState} from 'react';
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute, CognitoUserSession,
} from "amazon-cognito-identity-js";
import UserPool from "../security/data/UserPool"
import axios, {AxiosRequestConfig} from "axios";
import {Link, NavLink} from "react-router-dom";
import {Pages} from "../tools/RouterEnum";
import {ActionType, initialState, State} from "../model/token.model";
import getSessionAndVerify from "../security/auth";
import TokenContext from "../context/token-context";


function LoginPage() {
    const [state, dispatch] = useContext(TokenContext);
    const [username, setUsername] = useState("katzz");
    const [email, setEmail] = useState("katzz@seznam.cz");
    const [password, setPassword] = useState("Monitor11!");
    const [messageFromBackend, setMessageFromBackend] = useState("");
    const [imageFromBackend, setImageFromBackend] = useState("");
    const [imageThumbnailFromBackend, setImageThumbnailFromBackend] = useState("");
    const [uploadedImagePreview, setUploadedImagePreview] = useState("");
    const [uploadedImage, setUploadedImage] = useState(new Blob());

    // TODO: only for testing:
    const imageIdToShow:number = 25;
    const textImageIdToShow = `Show image ${imageIdToShow} from backend`;

    useEffect(() => {
        checkLoggedUser123(); // TODO: maybe delete
    }, [])

    async function checkLoggedUser123() {
        const session = await getSessionAndVerify();
        if (session) {
            setIsUserLogged(true);
            setLoggedUserUsername(session.getAccessToken().payload.username);
            setIdToken({idToken: session.getIdToken().getJwtToken()});
            setAccessToken({accessToken: session.getAccessToken().getJwtToken()});
            setRefreshToken({refreshToken: session.getRefreshToken().getToken()});
        } else {
            console.log("user is not logged");
            debugger;
            setIsUserLogged(false);
            setLoggedUserUsername("");
            setIdToken({idToken: null})
            setAccessToken({accessToken: null})
            setRefreshToken({refreshToken: null})
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
                checkLoggedUser123();
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
        debugger;
        setIsUserLogged(false);
        setLoggedUserUsername(null);
        setIdToken({idToken: null})
        setAccessToken({accessToken: null})
        setRefreshToken({refreshToken: null})
        if (user) {
            user.signOut();
        }
    }

    function setIdToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_ID_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setAccessToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_ACCESS_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setRefreshToken(tokens: Partial<State>) {

        // Merge with the current state so only provided tokens are changed
        dispatch({
            type: ActionType.SET_REFRESH_TOKEN,
            payload: {
                ...state,
                ...tokens
            }
        });
    }

    function setLoggedUserUsername(loggedUserUsername: string | null) {
        dispatch({
            type: ActionType.SET_USER_USERNAME,
            payload: {
                ...state,
                loggedUserUsername: loggedUserUsername
            }
        });
    }

    function setIsUserLogged(isUserLogged: boolean) {
        dispatch({
            type: ActionType.SET_IS_USER_LOGGED,
            payload: {
                ...state,
                isUserLogged: isUserLogged
            }
        });
    }
    
    function copyIdTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.idToken);
    }

    function copyAccessTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.accessToken);
    }

    function copyRefreshTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + state.refreshToken);
    }

    async function sendRequestToBackend() {
        const config = {
            headers: { Authorization: `Bearer ${state.idToken}` }
        };

        const response= await axios.get("http://localhost:8080/api/v1/data", config);
        console.log(response.data);
        setMessageFromBackend(response.data);
    }

    function showImageWithThumbnailFromBackend() {
        showImageFromBackend();
        showImageThumbnailFromBackend();
    }

    async function showImageFromBackend() {
        const config:AxiosRequestConfig  = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        const response = await axios.get("http://localhost:8080/api/v1/data/image/" + imageIdToShow, config);
        console.log(response.data);
        setImageFromBackend(URL.createObjectURL(response.data));
    }

    async function showImageThumbnailFromBackend() {
        const config:AxiosRequestConfig  = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${state.idToken}`
            },
        };

        const response = await axios.get("http://localhost:8080/api/v1/data/image/thumbnail/" + imageIdToShow, config);
        console.log(response.data);
        setImageThumbnailFromBackend(URL.createObjectURL(response.data));
    }

    function handleImageUpload(e:any) {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_file = e.target.files[0];
        setUploadedImage(image_as_file)
        setUploadedImagePreview(image_as_base64);
    }

    interface Photo {
        id?: number,
        photoOwner?: String,
        gpsPositionLatitude: number,
        gpsPositionLongitude: number,
        city?: String,
        region?: String,
        locality?: String,
        country?: String,
        continent?: String
    }

    function handleSubmit(e:React.FormEvent) {
        e.preventDefault();

        const photo:Photo = {
            gpsPositionLatitude: 50,
            gpsPositionLongitude: 15,
            city: 'Hradec Kralove'
        }

        const photoAsJson = JSON.stringify(photo);
        const blob = new Blob([photoAsJson], {
            type: 'application/json'
        });

        let formData = new FormData();
        formData.append('imageFile', uploadedImage);
        formData.append('photo', blob);

        axios.post('http://localhost:8080/api/v1/data',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${state.idToken}`,
                    "Content-type": "multipart/form-data",
                },
            }
        )
            .then(res => {
                console.log(`Success` + res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className={"login-page_wrapper"}>
            <h1>Welcome at Login page</h1>

            <div className="mainPage__link-wrapper">
                <div className="link-wrapper">
                    <NavLink to={Pages.ROOT}>To do - Just testing Link</NavLink>
                </div>
            </div>

            {!state.isUserLogged && (<>
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

            {state.isUserLogged && (<>
                <h1>Welcome {state.loggedUserUsername}</h1>

                <button onClick={logout}>Logout</button>
                
                <div>
                    <br/>
                    <button onClick={sendRequestToBackend}>Send request to backend</button>
                    <br/>
                    <br/>
                    <button onClick={showImageWithThumbnailFromBackend}>{textImageIdToShow}</button>
                    <br/>
                    <br/>
                    {messageFromBackend && <div>Message from backend = {messageFromBackend}</div>}
                    <br/>
                    {imageThumbnailFromBackend && <img src={imageThumbnailFromBackend} style={{maxWidth: "100%"}} alt={"image thumbnail from backend"}/>}
                    <br/>
                    {imageFromBackend && <img src={imageFromBackend} style={{maxWidth: "100%"}} alt={"image from backend"}/>}
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
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input type="text" name="photo"/>
                        </label>

                        <br/>

                        {uploadedImagePreview &&
                            <div className={"image_preview"}>
                                <img src={uploadedImagePreview} alt="image preview"/>
                            </div>
                        }

                        <br/>

                        <label>
                            Name:
                            <input type="file" name="inputFile" onChange={handleImageUpload}/>
                        </label>

                        <br/>

                        <input type="submit" value="Submit"/>

                        <br/>
                        <br/>

                        <div className="mainPage__link-wrapper">
                            <div className="link-wrapper">
                                <Link className="button" to={Pages.ALL_PHOTOS}>Show all your photos</Link>
                            </div>
                        </div>

                    </form>
                </div>

            </>)}

        </div>
    );
}

export default LoginPage;
