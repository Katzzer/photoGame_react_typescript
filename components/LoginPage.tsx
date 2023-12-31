import React, {useEffect, useState} from 'react';
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute, CognitoUserSession,
} from "amazon-cognito-identity-js";
import UserPool from "../security/data/UserPool"
import axios, {AxiosRequestConfig} from "axios";


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
    const [imageFromBackend, setImageFromBackend] = useState("");
    const [uploadedImagePreview, setUploadedImagePreview] = useState("");
    const [uploadedImage, setUploadedImage] = useState(new Blob());

    useEffect(() => {
        checkLoggedUser();
    }, [])
    
    function checkLoggedUser() {
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
        setIsUserLogged(false);
        setLoggedUserUsername("");
        setAccessToken("");
        setIdToken("");
        setRefreshToken("");
        if (user) {
            user.signOut();
        }
    }
    
    function copyIdTokenToClipboard() {
        navigator.clipboard.writeText("Bearer " + idToken);
    }
    
    async function sendRequestToBackend() {
        const config = {
            headers: { Authorization: `Bearer ${idToken}` }
        };

        const response = await axios.get("http://localhost:8080/api/v1/data", config);
        console.log(response.data);
        setMessageFromBackend(response.data);
    }

    async function showImageFromBackend() {
        const config:AxiosRequestConfig  = {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${idToken}`
            },
        };

        const response = await axios.get('http://localhost:8080/api/v1/data/image/1', config);
        console.log(response.data);
        setImageFromBackend(URL.createObjectURL(response.data));
    }

    function handleImageUpload(e:any) {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_file = e.target.files[0];
        setUploadedImage(image_as_file)
        setUploadedImagePreview(image_as_base64);
    }

    interface Photo {
        id?: number,
        uniqueUserId: String,
        position: Position
    }

    interface Position {
        id?: number,
        gpsPositionLatitude: number,
        gpsPositionLongitude: number,
        city: String,
        region?: String,
        locality?: String,
        country?: String,
        continent?: String
    }

    function handleSubmit(e:React.FormEvent) {
        e.preventDefault();

        const photo:Photo = {
            uniqueUserId: "123",
            position: {
                gpsPositionLatitude: 50,
                gpsPositionLongitude: 15,
                city: 'Hradec Kralove'
            }
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
                    Authorization: `Bearer ${idToken}`,
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
                    <button onClick={showImageFromBackend}>Show image 1 from backend</button>
                    <br/>
                    <br/>
                    <div>Message from backend = {messageFromBackend}</div>
                    <br/>
                    {imageFromBackend && <img src={imageFromBackend} style={{maxWidth: "100%"}} alt={"image from backend"}/>}
                    <br/>
                    <div>idToken = {idToken}</div>
                    <button onClick={copyIdTokenToClipboard}>Copy idToken</button>
                    <br/>
                    <div>accessToken = {accessToken}</div>
                    <br/>
                    <div>refreshToken = {refreshToken}</div>
                    <br/>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input type="text" name="photo" />
                        </label>

                        <br/>

                        {uploadedImagePreview && <img src={uploadedImagePreview} alt="image preview"/>}

                        <br/>

                        <label>
                            Name:
                            <input type="file" name="inputFile" onChange={handleImageUpload} />
                        </label>

                        <br/>

                        <input type="submit" value="Submit" />
                    </form>
                </div>
                
            </>)}
            
        </div>
    );
}

export default LoginPage;
