import { createContext, useEffect, useReducer, useState } from "react";
import {  onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
    idToken: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        //const unsubscribe = onAuthStateChanged(auth, async (user) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userInfo = {
                    uid: user.uid,
                    email: user.email,
                }
                localStorage.setItem("user", JSON.stringify(userInfo));
                const idToken = await user.getIdToken();
                dispatch({ type: "LOGIN", payload: {user, idToken} });
                
            } else {
                localStorage.removeItem("user");
                dispatch({ type: "LOGOUT" });
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{currentUser: state.currentUser, idToken: state.idToken, dispatch, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}