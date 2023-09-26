import React, { useContext, useState } from 'react';
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                })
        } catch (err) {
            console.error(err);
        }
    };

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                })
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    const resetPassword = async(email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            console.error(err);
        }
    }

    onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setLoading(false)
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}