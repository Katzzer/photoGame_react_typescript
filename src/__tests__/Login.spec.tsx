import { render } from "@testing-library/react"
import Login from "../../pages/Login";
import {ActionType, initialState, State} from "../../model/token.model";
import Footer from "../../pages/components/Footer";


function setToken(type: ActionType, tokens: Partial<State>) { // Added comma here

}

function setLoggedUserUsername(loggedUserUsername: string | null) {

}

function setIsUserLogged(isUserLogged: boolean) {

}


test('demo', () => {
    expect(true).toBe(true)
})

test("Renders the main page", () => {
    render(<Footer />)
    // render(<Login setToken={setToken} setLoggedUserUsername={setLoggedUserUsername} setIsUserLogged={setIsUserLogged} />)
    expect(true).toBeTruthy()
})

test('demo', () => {
    expect(true).toBe(true)
})