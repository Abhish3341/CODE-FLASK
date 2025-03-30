import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYjHHlGHmsCYh030ImEBtBfyxw2lMH9e8",
  authDomain: "code-flask.firebaseapp.com",
  projectId: "code-flask",
  storageBucket: "code-flask.firebasestorage.app",
  messagingSenderId: "643091309508",
  appId: "1:643091309508:web:2e7cb7da31e36598177a91",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);