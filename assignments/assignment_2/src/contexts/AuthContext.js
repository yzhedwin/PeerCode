import React, { useContext, useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
      }
    );
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
      }
    );
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  onAuthStateChanged(
    auth,
    (user) => {
      setCurrentUser(user);
      setLoading(false);
    },
    []
  );

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
