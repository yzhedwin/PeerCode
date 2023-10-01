import { auth, googleProvider } from "../../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";


export default function Auth() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  console.log(auth?.currentUser?.email);
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
    } catch (err) {
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
        .then((res) => {
          const credential = GoogleAuthProvider.credentialFromResult(res);
          const token = credential.accessToken;
          const user = res.user;
        })
    } catch (err) {
      console.error(err);
    }
  };
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      console.log("I AM LOGGED OUT");
    }
  });
  return (
    <div>
      <input placeholder="Email.." onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password.." onChange={(e) => setPassword(e.target.value)} />
      <button onClick={signIn}> Sign In</button>
      <button onClick={signInWithGoogle}> Sign In With Google</button>
      <button onClick={logOut}> Log Out</button>
    </div>
  );
};